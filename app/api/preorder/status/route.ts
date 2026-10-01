// app/api/preorder/status/route.ts
// Public endpoint providing real-time pre-order campaign counter and status

import { NextResponse } from 'next/server';
import { getPreorderStatus, calculateSteppedTier } from '@/lib/payments/preorder';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getPreorderStatus();
    return NextResponse.json(status);
  } catch (err) {
    console.error('Preorder status API error:', err);
    const fallbackClaimed = 14;
    return NextResponse.json(
      {
        totalClaimed: fallbackClaimed,
        maxSpots: 100,
        remainingTotal: 86,
        isPreorderActive: true,
        activeTier: calculateSteppedTier(fallbackClaimed),
      },
      { status: 200 }
    );
  }
}
