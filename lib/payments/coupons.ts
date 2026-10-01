// lib/payments/coupons.ts
// Coupon validation, affiliate attribution, and Stepped Tier discount calculation engine.

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountPercent: number;
  discountAmountCents: number;
  finalAmountCents: number;
  affiliateCode?: string;
  isAffiliate: boolean;
  message: string;
}

// Built-in founder and stepped campaign codes
const SYSTEM_DISCOUNT_CODES: Record<string, { percent: number; isAffiliate: boolean; label: string }> = {
  FOUNDER50: { percent: 50, isAffiliate: false, label: 'Super Early Bird Tier 1 (50% OFF)' },
  FOUNDER40: { percent: 40, isAffiliate: false, label: 'Early Bird Tier 2 (40% OFF)' },
  FOUNDER30: { percent: 30, isAffiliate: false, label: 'Founding Member Tier 3 (30% OFF)' },
  FOUNDER20: { percent: 20, isAffiliate: false, label: 'Final Founder Tier 4 (20% OFF)' },
  FOUNDER10: { percent: 10, isAffiliate: false, label: 'Founding Author Discount (10% OFF)' },
  LAUNCH50: { percent: 50, isAffiliate: false, label: 'Official Launch VIP (50% OFF)' },
  PREORDER: { percent: 50, isAffiliate: false, label: 'Pre-Order Stepped Tier Special' },
  FOUNDER: { percent: 50, isAffiliate: false, label: 'Stepped Founder Pass' },
  EARLYBIRD: { percent: 50, isAffiliate: false, label: 'Early Bird Pass' },
};

/**
 * Validates a coupon or affiliate promo code against an order amount and the current active stepped tier.
 */
export function validateCoupon(
  rawCode: string | null | undefined,
  orderAmountCents: number,
  activeTierPercent?: number
): CouponValidationResult {
  if (!rawCode || typeof rawCode !== 'string') {
    return {
      valid: false,
      code: '',
      discountPercent: 0,
      discountAmountCents: 0,
      finalAmountCents: orderAmountCents,
      isAffiliate: false,
      message: 'No coupon applied',
    };
  }

  const cleanCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

  if (cleanCode.length < 3 || cleanCode.length > 20) {
    return {
      valid: false,
      code: cleanCode,
      discountPercent: 0,
      discountAmountCents: 0,
      finalAmountCents: orderAmountCents,
      isAffiliate: false,
      message: 'Invalid coupon code format.',
    };
  }

  // 1. Dynamic Stepped Founder Codes (e.g. FOUNDER, PREORDER, EARLYBIRD)
  if (['FOUNDER', 'PREORDER', 'EARLYBIRD'].includes(cleanCode)) {
    const effectivePercent = activeTierPercent ?? 50;
    const discountAmountCents = Math.round((orderAmountCents * effectivePercent) / 100);
    const finalAmountCents = Math.max(orderAmountCents - discountAmountCents, 100);

    return {
      valid: true,
      code: cleanCode,
      discountPercent: effectivePercent,
      discountAmountCents,
      finalAmountCents,
      isAffiliate: false,
      message: `Founding Author Deal applied: ${effectivePercent}% OFF activated!`,
    };
  }

  // 2. Exact System Discount Codes (FOUNDER50, FOUNDER40, etc.)
  if (SYSTEM_DISCOUNT_CODES[cleanCode]) {
    const entry = SYSTEM_DISCOUNT_CODES[cleanCode];
    const discountAmountCents = Math.round((orderAmountCents * entry.percent) / 100);
    const finalAmountCents = Math.max(orderAmountCents - discountAmountCents, 100);

    return {
      valid: true,
      code: cleanCode,
      discountPercent: entry.percent,
      discountAmountCents,
      finalAmountCents,
      isAffiliate: false,
      message: `${entry.label} applied successfully!`,
    };
  }

  // 3. Dynamic Affiliate Codes (e.g. SARAH10, ALEX10, CREATOR)
  // Affiliate referrals receive the active Stepped Tier discount (e.g. 50% or 40%),
  // and the affiliate receives 10% cash commission of the paid transaction.
  const isAffiliatePattern = /^[A-Z0-9_-]{3,20}$/.test(cleanCode);
  if (isAffiliatePattern) {
    // If stepped tier discount is higher (e.g. 50%), buyer gets the higher discount!
    const buyerPercent = Math.max(activeTierPercent ?? 10, 10);
    const discountAmountCents = Math.round((orderAmountCents * buyerPercent) / 100);
    const finalAmountCents = Math.max(orderAmountCents - discountAmountCents, 100);

    return {
      valid: true,
      code: cleanCode,
      discountPercent: buyerPercent,
      discountAmountCents,
      finalAmountCents,
      affiliateCode: cleanCode,
      isAffiliate: true,
      message: `Partner code "${cleanCode}" applied: ${buyerPercent}% discount activated!`,
    };
  }

  return {
    valid: false,
    code: cleanCode,
    discountPercent: 0,
    discountAmountCents: 0,
    finalAmountCents: orderAmountCents,
    isAffiliate: false,
    message: 'Coupon code not found or expired.',
  };
}
