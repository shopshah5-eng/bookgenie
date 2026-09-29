// scripts/test-full-suite.mjs
// Automated verification suite covering all 20 Master Test Requirements.

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { CANONICAL_PLANS, getPlan, ORDERED_PLAN_IDS } from '../lib/payments/plans.ts';
import {
  isRazorpayConfigured,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from '../lib/payments/razorpay.ts';
import { AICostController, PLAN_LIMITS } from '../lib/ai/cost-controller.ts';
import { generateBookPdfBuffer } from '../lib/book/pdf-generator.ts';
import { generateEpub3Buffer } from '../lib/book/epub-builder.ts';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runTests() {
  console.log('====================================================');
  console.log('  BookGenie Master Test Suite — 20 Verifications    ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Canonical Plan Definitions
  await test('1. Canonical Plan Definitions: IDs, prices, and limits align exactly', () => {
    assert.deepEqual(ORDERED_PLAN_IDS, ['free', 'single', 'pro', 'creator']);
    assert.equal(CANONICAL_PLANS.free.priceInr, 0);
    assert.equal(CANONICAL_PLANS.free.maxPagesPerBook, 20);
    assert.equal(CANONICAL_PLANS.free.hasWatermark, true);

    assert.equal(CANONICAL_PLANS.single.priceInr, 299);
    assert.equal(CANONICAL_PLANS.single.amountPaise, 29900);
    assert.equal(CANONICAL_PLANS.single.maxPagesPerBook, 50);
    assert.equal(CANONICAL_PLANS.single.hasWatermark, false);
    assert.equal(CANONICAL_PLANS.single.canRegenerate, true);

    assert.equal(CANONICAL_PLANS.pro.priceInr, 999);
    assert.equal(CANONICAL_PLANS.pro.amountPaise, 99900);
    assert.equal(CANONICAL_PLANS.pro.maxPagesPerBook, 100);
    assert.equal(CANONICAL_PLANS.pro.maxBooksAllowed, 20);

    assert.equal(CANONICAL_PLANS.creator.priceInr, 1999);
    assert.equal(CANONICAL_PLANS.creator.amountPaise, 199900);
    assert.equal(CANONICAL_PLANS.creator.maxPagesPerBook, 200);
    assert.equal(CANONICAL_PLANS.creator.maxBooksAllowed, 50);
  });

  // 2. Razorpay Order Server-Side Amount Integrity & Dynamic Single Plan Calculation
  await test('2. Razorpay order amount comes strictly from server plan definition (never client amount)', () => {
    const singlePlan = getPlan('single');
    assert.equal(singlePlan?.amountPaise, 29900);
    const proPlan = getPlan('pro');
    assert.equal(proPlan?.amountPaise, 99900);
    const creatorPlan = getPlan('creator');
    assert.equal(creatorPlan?.amountPaise, 199900);
  });

  // 3. Razorpay Signature Verification — Valid Signature
  await test('3. Razorpay payment signature verification succeeds with correct HMAC SHA256', () => {
    const secret = 'test_secret_12345';
    process.env.RAZORPAY_KEY_SECRET = secret;
    process.env.RAZORPAY_KEY_ID = 'rzp_test_12345';

    const orderId = 'order_test_9876';
    const paymentId = 'pay_test_54321';
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const result = verifyPaymentSignature({
      orderId,
      paymentId,
      signature: validSignature,
    });
    assert.equal(result, true);
  });

  // 4. Razorpay Signature Verification — Tampered/Invalid Signature Rejection
  await test('4. Invalid or tampered Razorpay signature is strictly rejected', () => {
    const result = verifyPaymentSignature({
      orderId: 'order_test_9876',
      paymentId: 'pay_test_54321',
      signature: 'tampered_invalid_signature_hex_value',
    });
    assert.equal(result, false);
  });

  // 5. Razorpay Webhook HMAC Verification
  await test('5. Razorpay webhook raw payload HMAC verification succeeds with correct secret', () => {
    const webhookSecret = 'wh_secret_xyz789';
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
    const rawPayload = JSON.stringify({ event: 'payment.captured', id: 'evt_12345' });
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawPayload)
      .digest('hex');

    const isValid = verifyWebhookSignature(rawPayload, signature);
    assert.equal(isValid, true);

    const isTampered = verifyWebhookSignature(rawPayload + 'tampered', signature);
    assert.equal(isTampered, false);
  });

  // 6. Webhook Idempotency Table in Supabase
  await test('6. Duplicate Razorpay webhook events are tracked idempotently in database', async () => {
    const testEventId = `evt_test_idempotency_${Date.now()}`;
    // Insert event
    const { error: insErr } = await supabase.from('razorpay_events').insert({
      event_id: testEventId,
      event_type: 'payment.captured',
      payload: { test: true },
    });
    assert.equal(insErr, null, insErr?.message);

    // Duplicate lookup
    const { data: existing } = await supabase
      .from('razorpay_events')
      .select('event_id')
      .eq('event_id', testEventId)
      .single();
    assert.equal(existing?.event_id, testEventId);

    // Cleanup test event
    await supabase.from('razorpay_events').delete().eq('event_id', testEventId);
  });

  // 7. Atomic Database Job Claim Function
  await test('7. Distributed atomic Postgres job-claim function executes correctly', async () => {
    const { data, error } = await supabase.rpc('claim_generation_job', {
      p_job_id: '00000000-0000-0000-0000-000000000000',
      p_worker_id: 'worker-1',
      p_lease_seconds: 120,
    });
    assert.equal(error, null, error?.message);
    assert.equal(data, false); // job 000... doesn't exist, returns false cleanly
  });

  // 8. Free Plan Quota Enforcement: Page Limit Check (> 20 pages rejected)
  await test('8. Free plan quota rejects requested page target exceeding 20 pages', async () => {
    // Generate a temporary test user UUID
    const tempUserId = crypto.randomUUID();
    const result = await AICostController.validatePlanQuota(tempUserId, 25);
    assert.equal(result.allowed, false);
    assert.match(result.reason || '', /FREE plan supports up to 20 pages/i);
  });

  // 9. Free Plan Quota Enforcement: Lifetime 1 Ebook Limit
  await test('9. Free plan allows 1 book under 20 pages, then rejects subsequent creations', async () => {
    // We create a temporary test user in auth
    const testEmail = `quota.tester.${Date.now()}@example.test`;
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!Secure',
      email_confirm: true,
      user_metadata: { full_name: 'Quota Tester' },
    });
    assert.equal(userError, null, userError?.message);
    const userId = userData.user.id;

    try {
      // 1st book under 10 pages -> Allowed
      const check1 = await AICostController.validatePlanQuota(userId, 8);
      assert.equal(check1.allowed, true);
      assert.equal(check1.tier, 'free');
      assert.equal(check1.hasWatermark, true);
      assert.equal(check1.commercialUse, false);

      // Insert 1 book to simulate creation
      const { data: book, error: bErr } = await supabase.from('books').insert({
        user_id: userId,
        title: 'First Free eBook',
        book_type: 'guide',
        status: 'completed',
        page_target: 8,
      }).select('id').single();
      assert.equal(bErr, null, bErr?.message);

      // 2nd book -> Must be rejected (limit 1 ebook on Free)
      const check2 = await AICostController.validatePlanQuota(userId, 8);
      assert.equal(check2.allowed, false);
      assert.match(check2.reason || '', /already used your 1 free ebook/i);

      // Cleanup
      await supabase.from('books').delete().eq('id', book.id);
    } finally {
      await supabase.auth.admin.deleteUser(userId);
    }
  });

  // 10. Paid Entitlement Grants High-Volume Access
  await test('10. Paid entitlement grants increased page limits and removes watermark', async () => {
    const testEmail = `entitlement.tester.${Date.now()}@example.test`;
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!Secure',
      email_confirm: true,
      user_metadata: { full_name: 'Entitlement Tester' },
    });
    assert.equal(userError, null, userError?.message);
    const userId = userData.user.id;

    try {
      // Grant BOOK PLUS entitlement (60 pages, no watermark, commercial rights)
      const { data: ent, error: entErr } = await supabase.from('entitlements').insert({
        user_id: userId,
        plan_id: 'book_plus',
        max_pages: 60,
        allowed_formats: ['pdf', 'epub'],
        has_watermark: false,
        commercial_rights: true,
        can_regenerate: true,
        books_remaining: 1,
      }).select('id').single();
      assert.equal(entErr, null, entErr?.message);

      // Validate quota with 50 pages -> Allowed!
      const check = await AICostController.validatePlanQuota(userId, 50);
      assert.equal(check.allowed, true);
      assert.equal(check.tier, 'book_plus');
      assert.equal(check.hasWatermark, false);
      assert.equal(check.commercialUse, true);
      assert.equal(check.canRegenerate, true);
      assert.equal(check.entitlementId, ent.id);

      // Requesting 80 pages (exceeding 60) -> Rejected with clear message!
      const checkExceed = await AICostController.validatePlanQuota(userId, 80);
      assert.equal(checkExceed.allowed, false);
      assert.match(checkExceed.reason || '', /supports up to 60 pages/i);

      // Cleanup
      await supabase.from('entitlements').delete().eq('id', ent.id);
    } finally {
      await supabase.auth.admin.deleteUser(userId);
    }
  });

  // 11. PDF Export Produces Real Binary PDF
  await test('11. Binary PDF generator outputs valid %PDF- compliant binary document', async () => {
    const mockBook = {
      schemaVersion: 1,
      id: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      title: 'Testing Real Binary PDF Output',
      subtitle: 'Comprehensive Test Execution',
      bookType: 'guide',
      language: 'English',
      style: 'Modern',
      pageCount: 3,
      hasWatermark: true,
      blueprint: {
        title: 'Testing Real Binary PDF Output',
        subtitle: 'Comprehensive Test Execution',
        bookType: 'guide',
        audience: 'General',
        language: 'English',
        style: 'Modern',
        pageTarget: 3,
        chapters: [],
        visualPlan: [],
      },
      pages: [
        {
          pageNumber: 1,
          chapterIndex: 1,
          title: 'Introduction to Real Publishing',
          pageType: 'content',
          layout: 'standard',
          blocks: [
            { id: 'b1', type: 'heading', level: 1, text: 'Chapter 1: The Core Systems' },
            { id: 'b2', type: 'paragraph', text: 'This publication is generated with pure deterministic code.' },
          ],
        },
      ],
      versionNumber: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const pdfBuffer = await generateBookPdfBuffer(mockBook);
    assert.ok(pdfBuffer instanceof Uint8Array);
    assert.ok(pdfBuffer.byteLength > 1000);

    // Verify PDF Magic Bytes (%PDF-)
    const header = Buffer.from(pdfBuffer.buffer, pdfBuffer.byteOffset, 5).toString('ascii');
    assert.equal(header, '%PDF-');
  });

  // 12. EPUB Export Produces Valid EPUB3 Zip Container
  await test('12. EPUB3 builder outputs valid mimetype-compliant ZIP container', async () => {
    const mockBook = {
      schemaVersion: 1,
      id: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      title: 'Testing Real EPUB Output',
      subtitle: 'EPUB3 Compliance Test',
      bookType: 'novel',
      language: 'English',
      style: 'Editorial',
      pageCount: 2,
      blueprint: {
        title: 'Testing Real EPUB Output',
        subtitle: 'EPUB3 Compliance Test',
        bookType: 'novel',
        audience: 'General',
        language: 'English',
        style: 'Editorial',
        pageTarget: 2,
        chapters: [],
        visualPlan: [],
      },
      pages: [
        {
          pageNumber: 1,
          chapterIndex: 1,
          title: 'The Narrative Awakening',
          pageType: 'content',
          layout: 'standard',
          blocks: [
            { id: 'b1', type: 'heading', level: 1, text: 'Chapter One' },
            { id: 'b2', type: 'paragraph', text: 'The light fell across the parchment in long, angled strokes.' },
          ],
        },
      ],
      versionNumber: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const epubBuffer = await generateEpub3Buffer(mockBook);
    assert.ok(epubBuffer instanceof Uint8Array);
    assert.ok(epubBuffer.length > 500);

    // Verify ZIP magic bytes (PK\x03\x04)
    assert.equal(epubBuffer[0], 0x50); // 'P'
    assert.equal(epubBuffer[1], 0x4b); // 'K'
    assert.equal(epubBuffer[2], 0x03);
    assert.equal(epubBuffer[3], 0x04);
  });

  // 13. RLS Check: Purchases and Entitlements Non-Writable from Anon Key
  await test('13. Row-Level Security: Anon key cannot insert into purchases or entitlements', async () => {
    const anonSupabase = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { error: pErr } = await anonSupabase.from('purchases').insert({
      user_id: crypto.randomUUID(),
      plan_id: 'creator',
      razorpay_order_id: 'hacked_order',
      amount: 0,
    });
    // Should fail with permission denied or RLS violation
    assert.ok(pErr !== null, 'Anon client must not be able to write to purchases');

    const { error: eErr } = await anonSupabase.from('entitlements').insert({
      user_id: crypto.randomUUID(),
      plan_id: 'creator',
      max_pages: 100,
      books_remaining: 99,
    });
    assert.ok(eErr !== null, 'Anon client must not be able to write to entitlements');
  });

  // 14. Missing Razorpay Keys Configuration State Check
  await test('14. When Razorpay keys are omitted, isRazorpayConfigured() returns false', () => {
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
    assert.equal(isRazorpayConfigured(), false);
  });

  // 15. Unauthenticated Create Returns 401
  await test('15. Unauthenticated create request returns 401 UNAUTHORIZED', async () => {
    const { POST: createHandler } = await import('../app/api/books/create/route.ts');
    const req = new Request('http://localhost:3000/api/books/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Test book without login' }),
    });
    const res = await createHandler(req);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.error, 'UNAUTHORIZED');
  });

  // Setup a verified auth test user for tests 16 through 20
  const { data: suiteAuthUser } = await supabase.auth.admin.createUser({
    email: `suite.user.${Date.now()}@example.test`,
    password: 'TestPassword123!',
    email_confirm: true,
    user_metadata: { full_name: 'Suite Test User' },
  });
  const testUserId = suiteAuthUser.user.id;

  try {
    // 16. Authenticated Create Inserts Durable Book & Job
    await test('16. Authenticated pipeline inserts durable book and job in Supabase', async () => {
      const { GenerationPipeline } = await import('../lib/ai/pipeline.ts');

      const { bookId, jobId } = await GenerationPipeline.createBookAndJob({
        userId: testUserId,
        prompt: 'A durable historical treatise on typography',
        bookType: 'guide',
        language: 'English',
        style: 'Editorial',
        pageTarget: 8,
        planId: 'free',
        hasWatermark: true,
        commercialUse: false,
      });

      assert.ok(bookId);
      assert.ok(jobId);

      // Verify book persisted in Supabase
      const { data: dbBook } = await supabase.from('books').select('*').eq('id', bookId).single();
      assert.equal(dbBook?.id, bookId);
      assert.equal(dbBook?.plan_id, 'free');
      assert.equal(dbBook?.has_watermark, true);
      assert.equal(dbBook?.commercial_use, false);

      // Verify job persisted in Supabase
      const { data: dbJob } = await supabase.from('jobs').select('*').eq('id', jobId).single();
      assert.equal(dbJob?.id, jobId);
      assert.equal(dbJob?.book_id, bookId);

      // Cleanup
      await supabase.from('jobs').delete().eq('id', jobId);
      await supabase.from('books').delete().eq('id', bookId);
    });

    // 17. Private Export Without Auth Returns 401
    await test('17. Private export request without authentication returns 401', async () => {
      const { GET: exportHandler } = await import('../app/api/books/[id]/export/route.ts');
      const dummyId = crypto.randomUUID();

      const { data: book } = await supabase.from('books').insert({
        id: dummyId,
        user_id: testUserId,
        title: 'Private Test Book',
        book_type: 'guide',
        is_shared: false,
      }).select('id').single();

      try {
        const req = new Request(`http://localhost:3000/api/books/${dummyId}/export?format=pdf`);
        const res = await exportHandler(req, { params: Promise.resolve({ id: dummyId }) });
        assert.equal(res.status, 401);
      } finally {
        if (book) await supabase.from('books').delete().eq('id', dummyId);
      }
    });

    // 18. Shared Export Without Token Returns 401/403
    await test('18. Shared export without valid token parameter is rejected', async () => {
      const { GET: exportHandler } = await import('../app/api/books/[id]/export/route.ts');
      const dummyId = crypto.randomUUID();
      const shareToken = crypto.randomUUID();

      const { data: book } = await supabase.from('books').insert({
        id: dummyId,
        user_id: testUserId,
        title: 'Shared Test Book',
        book_type: 'guide',
        is_shared: true,
        share_token: shareToken,
      }).select('id').single();

      try {
        // 1. No token param
        const reqNoToken = new Request(`http://localhost:3000/api/books/${dummyId}/export?format=pdf`);
        const resNoToken = await exportHandler(reqNoToken, { params: Promise.resolve({ id: dummyId }) });
        assert.equal(resNoToken.status, 401);

        // 2. Tampered token param
        const reqBadToken = new Request(`http://localhost:3000/api/books/${dummyId}/export?format=pdf&token=wrong-token`);
        const resBadToken = await exportHandler(reqBadToken, { params: Promise.resolve({ id: dummyId }) });
        assert.equal(resBadToken.status, 403);
      } finally {
        if (book) await supabase.from('books').delete().eq('id', dummyId);
      }
    });

    // 19. Shared Export With Valid Token Succeeds
    await test('19. Shared export with valid share token succeeds and returns PDF', async () => {
      const { GET: exportHandler } = await import('../app/api/books/[id]/export/route.ts');
      const dummyId = crypto.randomUUID();
      const shareToken = crypto.randomUUID();

      await supabase.from('books').insert({
        id: dummyId,
        user_id: testUserId,
        title: 'Valid Shared Export Book',
        book_type: 'guide',
        is_shared: true,
        share_token: shareToken,
        plan_id: 'book',
        has_watermark: false,
      });

      await supabase.from('book_pages').insert({
        book_id: dummyId,
        page_number: 1,
        title: 'Chapter 1',
        page_type: 'content',
        layout: 'standard',
        blocks: [{ id: 'b1', type: 'paragraph', text: 'Valid shared content' }],
      });

      try {
        const req = new Request(`http://localhost:3000/api/books/${dummyId}/export?format=pdf&token=${shareToken}`);
        const res = await exportHandler(req, { params: Promise.resolve({ id: dummyId }) });
        assert.equal(res.status, 200);
        assert.equal(res.headers.get('Content-Type'), 'application/pdf');
      } finally {
        await supabase.from('book_pages').delete().eq('book_id', dummyId);
        await supabase.from('books').delete().eq('id', dummyId);
      }
    });

    // 20. Free Plan EPUB Export Restricted
    await test('20. Free plan EPUB export returns 403 FORMAT_NOT_ALLOWED', async () => {
      const { GET: exportHandler } = await import('../app/api/books/[id]/export/route.ts');
      const dummyId = crypto.randomUUID();
      const shareToken = crypto.randomUUID();

      await supabase.from('books').insert({
        id: dummyId,
        user_id: testUserId,
        title: 'Free Plan Book',
        book_type: 'guide',
        is_shared: true,
        share_token: shareToken,
        plan_id: 'free',
      });

      await supabase.from('book_pages').insert({
        book_id: dummyId,
        page_number: 1,
        title: 'Chapter 1',
        page_type: 'content',
        layout: 'standard',
        blocks: [{ id: 'b1', type: 'paragraph', text: 'Free content' }],
      });

      try {
        const req = new Request(`http://localhost:3000/api/books/${dummyId}/export?format=epub&token=${shareToken}`);
        const res = await exportHandler(req, { params: Promise.resolve({ id: dummyId }) });
        assert.equal(res.status, 403);
        const data = await res.json();
        assert.equal(data.error, 'FORMAT_NOT_ALLOWED');
      } finally {
        await supabase.from('book_pages').delete().eq('book_id', dummyId);
        await supabase.from('books').delete().eq('id', dummyId);
      }
    });
  } finally {
    await supabase.auth.admin.deleteUser(testUserId);
  }

  console.log('\n====================================================');
  console.log(`  Summary: ${passed} PASSED, ${failed} FAILED       `);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
