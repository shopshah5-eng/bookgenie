// app/api/ebooks/verify-order/route.ts
// Verifies transaction-specific unguessable order code or payment ID and issues download access.

import { NextRequest, NextResponse } from 'next/server';
import { findOrderByCodeOrId, generateEbookToken } from '@/lib/ebooks/order-store';
import { EBOOK_CATALOG } from '@/lib/ebooks/catalog';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = typeof body?.orderCode === 'string' ? body.orderCode.trim() : '';

    if (!query) {
      return NextResponse.json(
        { error: 'ORDER_CODE_REQUIRED', message: 'Please enter your Order Number or Payment ID.' },
        { status: 400 }
      );
    }

    const order = await findOrderByCodeOrId(query);

    if (!order) {
      return NextResponse.json(
        {
          error: 'ORDER_NOT_FOUND',
          message: 'No purchase found matching this Order Number or Payment ID. Please check and try again.',
        },
        { status: 404 }
      );
    }

    const token = generateEbookToken(order.orderCode, order.slug);
    const catalogItem = EBOOK_CATALOG[order.slug];

    return NextResponse.json({
      valid: true,
      orderCode: order.orderCode,
      slug: order.slug,
      title: catalogItem?.title || order.bookTitle,
      subtitle: catalogItem?.subtitle || '',
      coverImage: catalogItem?.coverImage || '',
      pageCount: catalogItem?.pageCount || 40,
      amount: order.amount,
      createdAt: order.createdAt,
      downloadUrl: `/api/ebooks/download/${order.slug}?token=${token}&orderCode=${encodeURIComponent(order.orderCode)}`,
    });
  } catch (err) {
    console.error('Verify order error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Failed to verify order number. Please try again.' },
      { status: 500 }
    );
  }
}
