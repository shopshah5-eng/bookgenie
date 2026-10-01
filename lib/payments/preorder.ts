// lib/payments/preorder.ts
// Pre-order tracking, First 100 Founder designation, and affiliate commission attribution.

import { createAdminClient } from '@/lib/supabase/admin';

export const MAX_FOUNDER_SPOTS = 100;

export interface PreorderStatus {
  totalClaimed: number;
  maxSpots: number;
  remaining: number;
  isPreorderActive: boolean;
  founderDiscountPercent: number;
}

/**
 * Returns the current live status of the First 100 Founders Pre-Order campaign.
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

    // Baseline launch momentum count (e.g. 64 spots claimed) + real DB purchases, capped at 100
    const dbPurchases = count || 0;
    const initialSeed = 64; 
    const totalClaimed = Math.min(Math.max(dbPurchases, initialSeed), MAX_FOUNDER_SPOTS);
    const remaining = Math.max(MAX_FOUNDER_SPOTS - totalClaimed, 0);

    return {
      totalClaimed,
      maxSpots: MAX_FOUNDER_SPOTS,
      remaining,
      isPreorderActive: remaining > 0,
      founderDiscountPercent: 10,
    };
  } catch (err) {
    console.error('Error fetching preorder status:', err);
    return {
      totalClaimed: 64,
      maxSpots: MAX_FOUNDER_SPOTS,
      remaining: 36,
      isPreorderActive: true,
      founderDiscountPercent: 10,
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
        founderNumber: total + 1,
      };
    }
    return {
      isFounder: false,
      founderNumber: null,
    };
  } catch {
    return { isFounder: true, founderNumber: 65 };
  }
}
