// lib/payments/coupons.ts
// Coupon validation, affiliate attribution, and 10% discount calculation engine.

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

// Built-in founder and early bird campaign codes
const SYSTEM_DISCOUNT_CODES: Record<string, { percent: number; isAffiliate: boolean; label: string }> = {
  FOUNDER10: { percent: 10, isAffiliate: false, label: 'Founding Author Early Bird (10% OFF)' },
  PREORDER10: { percent: 10, isAffiliate: false, label: 'Pre-Order Special Discount (10% OFF)' },
  EARLYBIRD10: { percent: 10, isAffiliate: false, label: 'Early Bird Creator Pass (10% OFF)' },
  LAUNCH10: { percent: 10, isAffiliate: false, label: 'Launch Special (10% OFF)' },
  BOOK10: { percent: 10, isAffiliate: false, label: 'Reader Welcome Discount (10% OFF)' },
  GENIE10: { percent: 10, isAffiliate: false, label: 'BookGenie Insider (10% OFF)' },
};

/**
 * Validates a coupon or affiliate promo code against an order amount.
 * Applies a 10% discount to valid codes and attributes 10% cash commission to the affiliate.
 */
export function validateCoupon(
  rawCode: string | null | undefined,
  orderAmountCents: number
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

  // 1. Check known system discount codes
  if (SYSTEM_DISCOUNT_CODES[cleanCode]) {
    const entry = SYSTEM_DISCOUNT_CODES[cleanCode];
    const discountAmountCents = Math.round((orderAmountCents * entry.percent) / 100);
    const finalAmountCents = Math.max(orderAmountCents - discountAmountCents, 100); // Minimum $1.00

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

  // 2. Dynamic Affiliate Codes (e.g. SARAH10, ALEX10, CREATOR, KDPPRO)
  // Any valid alphanumeric code passed from affiliate link or typed in coupon box
  // grants a 10% buyer discount and marks the code for 10% affiliate commission.
  const isAffiliatePattern = /^[A-Z0-9_-]{3,20}$/.test(cleanCode);
  if (isAffiliatePattern) {
    const affiliatePercent = 10;
    const discountAmountCents = Math.round((orderAmountCents * affiliatePercent) / 100);
    const finalAmountCents = Math.max(orderAmountCents - discountAmountCents, 100);

    return {
      valid: true,
      code: cleanCode,
      discountPercent: affiliatePercent,
      discountAmountCents,
      finalAmountCents,
      affiliateCode: cleanCode,
      isAffiliate: true,
      message: `Affiliate code "${cleanCode}" applied: 10% discount activated!`,
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
