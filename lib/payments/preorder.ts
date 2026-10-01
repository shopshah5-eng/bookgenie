// lib/payments/preorder.ts
// Stepped Tier Pre-Order tracking, Founder designation, and pricing escalator.

import { createAdminClient } from '@/lib/supabase/admin';

export const MAX_FOUNDER_SPOTS = 100;

export interface SteppedTierInfo {
  tierNumber: 1 | 2 | 3 | 4 | 5; // 1 to 4 active, 5 = closed
  tierName: string;
  discountPercent: number;
  tierRange: string;
  spotsInTier: number;
  remainingInTier: number;
  nextTierPercent: number;
}

export interface PreorderStatus {
  totalClaimed: number;
  maxSpots: number;
  remainingTotal: number;
  isPreorderActive: boolean;
  activeTier: SteppedTierInfo;
}

/**
 * Calculates which stepped discount tier is active based on total pre-orders claimed.
 * Tier 1 (1–25):   50% OFF ($4.50 single book)
 * Tier 2 (26–50):  40% OFF ($5.40 single book)
 * Tier 3 (51–75):  30% OFF ($6.30 single book)
 * Tier 4 (76–100): 20% OFF ($7.20 single book)
 * Tier 5 (100+):   Full Price ($9.00 single book)
 */
export function calculateSteppedTier(totalClaimed: number): SteppedTierInfo {
  if (totalClaimed < 25) {
    return {
      tierNumber: 1,
      tierName: 'Tier 1: Super Early Bird',
      discountPercent: 50,
      tierRange: 'Spots 1 – 25',
      spotsInTier: 25,
      remainingInTier: Math.max(25 - totalClaimed, 0),
      nextTierPercent: 40,
    };
  }
  if (totalClaimed < 50) {
    return {
      tierNumber: 2,
      tierName: 'Tier 2: Early Bird',
      discountPercent: 40,
      tierRange: 'Spots 26 – 50',
      spotsInTier: 25,
      remainingInTier: Math.max(50 - totalClaimed, 0),
      nextTierPercent: 30,
    };
  }
  if (totalClaimed < 75) {
    return {
      tierNumber: 3,
      tierName: 'Tier 3: Founding Member',
      discountPercent: 30,
      tierRange: 'Spots 51 – 75',
      spotsInTier: 25,
      remainingInTier: Math.max(75 - totalClaimed, 0),
      nextTierPercent: 20,
    };
  }
  if (totalClaimed < 100) {
    return {
      tierNumber: 4,
      tierName: 'Tier 4: Final Founder Call',
      discountPercent: 20,
      tierRange: 'Spots 76 – 100',
      spotsInTier: 25,
      remainingInTier: Math.max(100 - totalClaimed, 0),
      nextTierPercent: 0,
    };
  }
  return {
    tierNumber: 5,
    tierName: 'Standard Public Release',
    discountPercent: 0,
    tierRange: '100+ Orders',
    spotsInTier: 0,
    remainingInTier: 0,
    nextTierPercent: 0,
  };
}

/**
 * Returns the live status of the Stepped Pre-Order campaign.
 */
export async function getPreorderStatus(): Promise<PreorderStatus> {
  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'captured');

    if (error) {
      console.warn('Could not count completed purchases for preorder status:', error.message);
    }

    // Launch momentum baseline (e.g. 14 spots claimed in Tier 1 at 50% OFF) + real DB purchases
    const dbPurchases = count || 0;
    const initialSeed = 14; 
    const totalClaimed = Math.min(Math.max(dbPurchases, initialSeed), MAX_FOUNDER_SPOTS);
    const remainingTotal = Math.max(MAX_FOUNDER_SPOTS - totalClaimed, 0);
    const activeTier = calculateSteppedTier(totalClaimed);

    return {
      totalClaimed,
      maxSpots: MAX_FOUNDER_SPOTS,
      remainingTotal,
      isPreorderActive: remainingTotal > 0,
      activeTier,
    };
  } catch (err) {
    console.error('Error fetching preorder status:', err);
    const fallbackClaimed = 14;
    return {
      totalClaimed: fallbackClaimed,
      maxSpots: MAX_FOUNDER_SPOTS,
      remainingTotal: 86,
      isPreorderActive: true,
      activeTier: calculateSteppedTier(fallbackClaimed),
    };
  }
}

/**
 * Assigns a sequential founder number for the first 100 users.
 */
export async function determineFounderNumber(): Promise<{ isFounder: boolean; founderNumber: number | null }> {
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'captured');

    const total = count || 0;
    if (total < MAX_FOUNDER_SPOTS) {
      return {
        isFounder: true,
        founderNumber: Math.max(total + 1, 15),
      };
    }
    return {
      isFounder: false,
      founderNumber: null,
    };
  } catch {
    return { isFounder: true, founderNumber: 15 };
  }
}
