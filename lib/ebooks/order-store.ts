// lib/ebooks/order-store.ts
// Secure, high-entropy unguessable order code generator and dual-persistence order store.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createAdminClient } from '@/lib/supabase/admin';

export interface EbookOrderRecord {
  orderCode: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  slug: 'blueprint' | 'glow-up' | 'starter-kit';
  bookTitle: string;
  amount: number; // in INR
  createdAt: string;
}

const ORDERS_FILE = path.join(process.cwd(), 'data', 'ebook_orders.json');
const ORDER_CODE_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32 without ambiguous 0, 1, O, I

/**
 * Generates an unguessable, high-entropy Order Access Code.
 * Format: BG-XXXX-XXXX-XXXX (e.g. BG-9K2M-4F8X-7W3Q)
 * Entropy: 32^12 ≈ 1.15 × 10^18 combinations. Completely impossible to guess.
 */
export function generateOrderCode(): string {
  const bytes = crypto.randomBytes(12);
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += ORDER_CODE_CHARSET[bytes[i] % ORDER_CODE_CHARSET.length];
  }
  const chunk1 = code.slice(0, 4);
  const chunk2 = code.slice(4, 8);
  const chunk3 = code.slice(8, 12);
  return `BG-${chunk1}-${chunk2}-${chunk3}`;
}

/**
 * Generates a signed cryptographic download token for an order.
 */
export function generateEbookToken(orderCode: string, slug: string): string {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'bookgenie-secure-order-key';
  return crypto.createHmac('sha256', secret).update(`${orderCode}:${slug}`).digest('hex');
}

/**
 * Verifies a cryptographic download token.
 */
export function verifyEbookToken(orderCode: string, slug: string, token: string): boolean {
  if (!token) return false;
  const expected = generateEbookToken(orderCode, slug);
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

// In-memory cache for fast lookup
const memoryOrders = new Map<string, EbookOrderRecord>();

function ensureDataDirectory() {
  const dir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadLocalOrders(): EbookOrderRecord[] {
  try {
    ensureDataDirectory();
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(content) as EbookOrderRecord[];
    }
  } catch (err) {
    console.warn('[OrderStore] Could not read local orders file:', err);
  }
  return [];
}

function saveLocalOrder(order: EbookOrderRecord) {
  try {
    ensureDataDirectory();
    const existing = loadLocalOrders();
    const filtered = existing.filter(
      (o) => o.orderCode !== order.orderCode && o.razorpayPaymentId !== order.razorpayPaymentId
    );
    filtered.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[OrderStore] Could not save to local orders file:', err);
  }
}

/**
 * Saves a completed purchase order to both memory/local disk and Supabase.
 */
export async function recordEbookOrder(order: EbookOrderRecord): Promise<void> {
  // 1. Cache in memory
  memoryOrders.set(order.orderCode, order);
  memoryOrders.set(order.razorpayOrderId, order);
  memoryOrders.set(order.razorpayPaymentId, order);

  // 2. Persist locally
  saveLocalOrder(order);

  // 3. Persist to Supabase dedicated table and purchases table
  try {
    const admin = createAdminClient();

    // Insert into dedicated ebook_orders table
    await admin.from('ebook_orders').upsert({
      order_code: order.orderCode,
      razorpay_order_id: order.razorpayOrderId,
      razorpay_payment_id: order.razorpayPaymentId,
      slug: order.slug,
      book_title: order.bookTitle,
      amount: order.amount,
      metadata: {
        createdAt: order.createdAt,
      },
    }, { onConflict: 'order_code' });

    // Also record in purchases table for consolidated bookkeeping
    await admin.from('purchases').insert({
      plan_id: order.slug,
      razorpay_order_id: order.razorpayOrderId,
      razorpay_payment_id: order.razorpayPaymentId,
      amount: order.amount * 100,
      currency: 'INR',
      status: 'captured',
      notes: {
        orderCode: order.orderCode,
        slug: order.slug,
        bookTitle: order.bookTitle,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    console.warn('[OrderStore] Supabase order persist notice:', err);
  }
}

/**
 * Finds an order by its unique Order Code (BG-XXXX-XXXX-XXXX)
 * or by Razorpay Payment ID (pay_...) or Order ID (order_...).
 */
export async function findOrderByCodeOrId(query: string): Promise<EbookOrderRecord | null> {
  if (!query) return null;
  const cleaned = query.trim().toUpperCase();
  const rawCleaned = query.trim();

  // 1. Check in-memory
  if (memoryOrders.has(cleaned)) return memoryOrders.get(cleaned)!;
  if (memoryOrders.has(rawCleaned)) return memoryOrders.get(rawCleaned)!;

  // 2. Check local file
  const localOrders = loadLocalOrders();
  const localMatch = localOrders.find(
    (o) =>
      o.orderCode.toUpperCase() === cleaned ||
      o.orderCode.replace(/-/g, '').toUpperCase() === cleaned.replace(/-/g, '') ||
      o.razorpayPaymentId.toLowerCase() === rawCleaned.toLowerCase() ||
      o.razorpayOrderId.toLowerCase() === rawCleaned.toLowerCase()
  );

  if (localMatch) {
    memoryOrders.set(localMatch.orderCode, localMatch);
    memoryOrders.set(localMatch.razorpayOrderId, localMatch);
    memoryOrders.set(localMatch.razorpayPaymentId, localMatch);
    return localMatch;
  }

  // 3. Check Supabase (dedicated ebook_orders table first)
  try {
    const admin = createAdminClient();

    // Query ebook_orders table by order_code, payment_id, or order_id
    const { data: ebookMatch } = await admin
      .from('ebook_orders')
      .select('*')
      .or(`order_code.eq.${cleaned},razorpay_payment_id.eq.${rawCleaned},razorpay_order_id.eq.${rawCleaned}`)
      .limit(1);

    if (ebookMatch && ebookMatch.length > 0) {
      const row = ebookMatch[0];
      const record: EbookOrderRecord = {
        orderCode: row.order_code,
        razorpayOrderId: row.razorpay_order_id,
        razorpayPaymentId: row.razorpay_payment_id,
        slug: (row.slug === 'glow-up' ? 'glow-up' : 'blueprint') as 'blueprint' | 'glow-up',
        bookTitle: row.book_title || 'Digital Edition',
        amount: row.amount,
        createdAt: row.created_at || new Date().toISOString(),
      };
      memoryOrders.set(record.orderCode, record);
      memoryOrders.set(record.razorpayPaymentId, record);
      memoryOrders.set(record.razorpayOrderId, record);
      return record;
    }

    // Fallback: Check purchases table
    const { data } = await admin
      .from('purchases')
      .select('*')
      .or(`razorpay_order_id.eq.${rawCleaned},razorpay_payment_id.eq.${rawCleaned}`)
      .limit(1);

    let p = data && data.length > 0 ? data[0] : null;

    if (!p) {
      const { data: notesMatch } = await admin
        .from('purchases')
        .select('*')
        .eq('notes->>orderCode', cleaned)
        .limit(1);
      if (notesMatch && notesMatch.length > 0) {
        p = notesMatch[0];
      }
    }

    if (p) {
      const notes = (p.notes || {}) as Record<string, unknown>;
      const record: EbookOrderRecord = {
        orderCode: (notes.orderCode as string) || cleaned,
        razorpayOrderId: p.razorpay_order_id,
        razorpayPaymentId: p.razorpay_payment_id || '',
        slug: (p.plan_id === 'glow-up' ? 'glow-up' : 'blueprint') as 'blueprint' | 'glow-up',
        bookTitle: (notes.bookTitle as string) || 'Digital Edition',
        amount: Math.round((p.amount || 0) / 100),
        createdAt: p.created_at || new Date().toISOString(),
      };
      memoryOrders.set(record.orderCode, record);
      return record;
    }
  } catch (dbErr) {
    console.warn('[OrderStore] Supabase query notice:', dbErr);
  }

  return null;
}
