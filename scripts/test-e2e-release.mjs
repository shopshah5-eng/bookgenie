import { createClient } from '@supabase/supabase-js';
import * as ssr from '@supabase/ssr';
import fs from 'node:fs';

const PREVIEW_URL = 'https://deploy-preview-2--bookgenie-app.netlify.app';

// Load .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey || !anonKey) {
  throw new Error('Missing Supabase configuration in .env.local');
}

const adminSupabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log('=== Step 6: Real Authenticated End-to-End Test ===');
  console.log('Target Preview URL:', PREVIEW_URL);

  const testEmail = 'release-tester@bookgenie.test';
  const testPassword = 'TestPassword123!Release';

  // 1. Ensure test user exists
  console.log('\n1. Ensuring test user exists in Supabase...');
  let userId;
  const { data: listData, error: listError } = await adminSupabase.auth.admin.listUsers();
  if (listError) throw listError;
  const existingUser = listData.users.find(u => u.email === testEmail);

  if (existingUser) {
    userId = existingUser.id;
    console.log('Found existing test user:', userId);
    // Update password to be certain
    await adminSupabase.auth.admin.updateUserById(userId, { password: testPassword });
  } else {
    const { data: createData, error: createError } = await adminSupabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: 'Release Tester' },
    });
    if (createError) throw createError;
    userId = createData.user.id;
    console.log('Created new test user:', userId);
  }

  // Ensure profile exists and plan tier is pro so quota allows 16 pages
  const { error: profileErr } = await adminSupabase.from('profiles').upsert({
    id: userId,
    full_name: 'Release Tester',
    email: testEmail,
    tier: 'pro',
  });
  if (profileErr) {
    console.error('Profile update error:', profileErr);
    throw profileErr;
  }
  console.log('User profile set to tier: pro');

  // Clean previous test books for this test user
  await adminSupabase.from('books').delete().eq('user_id', userId);

  // 2. Sign in with password to obtain authenticated session
  console.log('\n2. Signing in to obtain authenticated session...');
  const userClient = createClient(supabaseUrl, anonKey);
  const { data: authData, error: authError } = await userClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  if (authError) throw authError;

  const session = authData.session;
  console.log('Authenticated session obtained. Access token valid.');

  // Create SSR cookies using browserClient
  let capturedCookies = {};
  const browserClient = ssr.createBrowserClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return Object.entries(capturedCookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          capturedCookies[name] = value;
        });
      },
    },
  });

  await browserClient.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  const cookieHeader = Object.entries(capturedCookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');

  // 3. Initiate Generation: 16-page book
  console.log('\n3. Calling POST /api/books/create for 16-page book...');
  const createPayload = {
    prompt: 'A practical illustrated guide to growing herbs on a small apartment balcony',
    pageTarget: 16,
    bookType: 'guide',
    style: 'editorial',
  };

  const createRes = await fetch(`${PREVIEW_URL}/api/books/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify(createPayload),
  });

  console.log('Create Response Status:', createRes.status, createRes.statusText);
  const createJson = await createRes.json();
  console.log('Create Response Body:', createJson);

  if (createRes.status !== 200) {
    throw new Error(`Failed to create book: ${JSON.stringify(createJson)}`);
  }

  const { bookId, jobId } = createJson;
  if (!bookId || !jobId) {
    throw new Error('Missing bookId or jobId in response');
  }

  // 4. Poll Generation Job to completion
  console.log(`\n4. Polling generation status for bookId: ${bookId}, jobId: ${jobId}...`);
  let status = 'planning';
  let prevProgress = -1;
  let attempts = 0;
  const maxAttempts = 60; // Up to 5-10 minutes if needed

  while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
    attempts++;
    await new Promise(r => setTimeout(r, 4000));

    const pollRes = await fetch(`${PREVIEW_URL}/api/books/${bookId}/status?jobId=${jobId}`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (pollRes.status !== 200) {
      console.error(`Poll returned ${pollRes.status}:`, await pollRes.text());
      continue;
    }

    const pollJson = await pollRes.json();
    status = pollJson.status;
    const progress = pollJson.progress;
    const stage = pollJson.stage;
    const steps = (pollJson.stepsCompleted || []).join(' -> ');

    console.log(`[Attempt ${attempts}] Stage: ${stage} | Progress: ${progress}% | Status: ${status} | Steps: ${steps}`);

    if (progress < prevProgress && status !== 'failed') {
      console.warn(`WARNING: Progress decreased from ${prevProgress}% to ${progress}%`);
    }
    prevProgress = progress;

    if (status === 'completed') {
      console.log('>>> Generation completed successfully! <<<');
      break;
    }
    if (status === 'failed') {
      throw new Error(`Generation failed: ${pollJson.error}`);
    }
  }

  if (status !== 'completed') {
    throw new Error(`Generation timed out after ${attempts} attempts`);
  }

  // 5. Database Verification
  console.log('\n5. Verifying database records in Supabase...');
  const { data: dbBook, error: dbBookError } = await adminSupabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();
  if (dbBookError) throw dbBookError;

  console.log('Book record:', {
    id: dbBook.id,
    title: dbBook.title,
    page_count: dbBook.page_count,
    status: dbBook.status,
    has_cover: !!dbBook.cover_url,
  });

  if (dbBook.status !== 'completed') {
    throw new Error(`Expected book status 'completed', got '${dbBook.status}'`);
  }
  if (dbBook.page_count !== 16) {
    console.warn(`Book page count is ${dbBook.page_count} (requested 16)`);
  }

  const { data: dbPages, error: dbPagesError } = await adminSupabase
    .from('book_pages')
    .select('page_number, title')
    .eq('book_id', bookId)
    .order('page_number');
  if (dbPagesError) throw dbPagesError;

  console.log(`Verified ${dbPages.length} book pages in database.`);
  if (dbPages.length === 0) {
    throw new Error('Zero pages found in book_pages table!');
  }

  const { data: dbAssets, error: dbAssetsError } = await adminSupabase
    .from('assets')
    .select('id, bucket, path, asset_type')
    .eq('book_id', bookId);
  if (dbAssetsError) throw dbAssetsError;

  console.log(`Verified ${dbAssets.length} assets recorded for book:`);
  for (const asset of dbAssets) {
    console.log(` - [${asset.asset_type}] ${asset.bucket}/${asset.path}`);
    if (asset.bucket === 'demo') {
      throw new Error('CRITICAL: Asset was saved in demo bucket!');
    }
  }

  // 6. Test PDF and EPUB Exports
  console.log('\n6. Testing PDF and EPUB exports...');
  const pdfRes = await fetch(`${PREVIEW_URL}/api/books/${bookId}/export?format=pdf`, {
    headers: { Cookie: cookieHeader },
  });
  console.log('PDF export status:', pdfRes.status, pdfRes.statusText);
  if (pdfRes.status !== 200) {
    throw new Error(`PDF export failed with status ${pdfRes.status}`);
  }
  const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
  const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii');
  console.log('PDF header:', pdfHeader, `(Length: ${pdfBuffer.length} bytes)`);
  if (!pdfHeader.startsWith('%PDF-')) {
    throw new Error(`Invalid PDF header: ${pdfHeader}`);
  }

  const epubRes = await fetch(`${PREVIEW_URL}/api/books/${bookId}/export?format=epub`, {
    headers: { Cookie: cookieHeader },
  });
  console.log('EPUB export status:', epubRes.status, epubRes.statusText);
  if (epubRes.status !== 200) {
    throw new Error(`EPUB export failed with status ${epubRes.status}`);
  }
  const epubBuffer = Buffer.from(await epubRes.arrayBuffer());
  console.log(`EPUB export received: ${epubBuffer.length} bytes`);
  // EPUB is a zip file starting with PK (0x50, 0x4B)
  if (epubBuffer[0] !== 0x50 || epubBuffer[1] !== 0x4B) {
    throw new Error('EPUB export is not a valid zip archive');
  }

  // 7. Test Natural Language Revision
  console.log('\n7. Testing natural language revision...');
  const regenRes = await fetch(`${PREVIEW_URL}/api/books/${bookId}/regenerate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      instruction: 'Change Chapter 1 heading to: The Balcony Sanctuary',
    }),
  });
  console.log('Regenerate status:', regenRes.status, regenRes.statusText);
  const regenJson = await regenRes.json();
  console.log('Regenerate response:', regenJson);

  // Check version in book_versions table
  const { data: versions, error: versionsError } = await adminSupabase
    .from('book_versions')
    .select('version_number, revision_prompt, created_at')
    .eq('book_id', bookId)
    .order('version_number', { ascending: false });
  if (versionsError) throw versionsError;

  console.log(`Found ${versions.length} versions in book_versions:`, versions);
  if (versions.length === 0) {
    throw new Error('No version snapshot created in public.book_versions!');
  }

  // 8. Test Secure Sharing
  console.log('\n8. Testing secure sharing flow...');
  const shareRes = await fetch(`${PREVIEW_URL}/api/books/${bookId}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  });
  console.log('Share status:', shareRes.status, shareRes.statusText);
  const shareJson = await shareRes.json();
  console.log('Share response:', shareJson);
  const shareToken = shareJson.shareToken || shareJson.share_token;
  if (!shareToken) {
    throw new Error('Missing shareToken in share response');
  }

  // Fetch as unauthenticated visitor
  console.log(`Testing unauthenticated read of /api/shared/${shareToken}...`);
  const publicShareRes = await fetch(`${PREVIEW_URL}/api/shared/${shareToken}`);
  console.log('Public share status:', publicShareRes.status, publicShareRes.statusText);
  const publicShareJson = await publicShareRes.json();
  console.log('Public share book title:', publicShareJson.book?.title);
  console.log('Public share author masked:', publicShareJson.book?.author || publicShareJson.book?.authorName);

  // Verify unauthenticated user CANNOT regenerate the book
  console.log('Testing unauthenticated regenerate attempt (should be 401/403)...');
  const attackRes = await fetch(`${PREVIEW_URL}/api/books/${bookId}/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instruction: 'Malicious modification' }),
  });
  console.log('Unauthenticated regenerate status:', attackRes.status);
  if (attackRes.status !== 401 && attackRes.status !== 403) {
    throw new Error(`Expected 401 or 403 for unauthorized regenerate, got ${attackRes.status}`);
  }

  console.log('\n=========================================');
  console.log('🎉 ALL STEP 6 END-TO-END TESTS PASSED! 🎉');
  console.log('=========================================');
}

run().catch(err => {
  console.error('\n❌ STEP 6 TEST FAILED:', err);
  process.exit(1);
});
