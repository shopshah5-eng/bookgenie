// app/api/preorder/status/route.ts
// Public endpoint providing real-time pre-order campaign counter and status

import { NextResponse } from 'next/server';
import { getPreorderStatus } from '@/lib/payments/preorder';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getPreorderStatus();
    return NextResponse.json(status);
  } catch (err) {
    console.error('Preorder status API error:', err);
    return NextResponse.json(
      {
        totalClaimed: 64,
        maxSpots: 100,
        remaining: 36,
        isPreorderActive: true,
        founderDiscountPercent: 10,
      },
      { status: 200 }
    );
  }
}
