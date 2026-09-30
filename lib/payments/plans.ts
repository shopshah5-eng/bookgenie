// lib/payments/plans.ts
// Canonical single source of truth for all BookGenie plans and entitlements.
// Shared by frontend pricing UI, backend quota checks, Razorpay orders, and exports.

export type PlanId = 'free' | 'single' | 'pro' | 'creator';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  badge?: string;
  priceUsd: number;
  amountCents: number;
  // Backward compatibility accessors
  priceInr?: number;
  amountPaise?: number;
  billingType: 'free' | 'one_time' | 'subscription';
  currency: 'USD';
  description: string;
  features: string[];
  maxPagesPerBook: number;
  maxBooksAllowed: number; // 1 for single/free, 20 for pro, 50 for creator
  allowedFormats: ('pdf' | 'epub')[];
  hasWatermark: boolean;
  commercialUse: boolean;
  enhancedIllustrations: boolean;
  canRegenerate: boolean;
  prioritySupport: boolean;
  annualPriceUsd?: number;
  annualAmountCents?: number;
  annualPriceInr?: number;
  annualAmountPaise?: number;
}

/**
 * Calculates dynamic price for Single Book plan based on page count.
 * Base: $9 for up to 50 pages (900 cents).
 * Beyond 50 pages: +$0.10 per extra page (e.g., 100 pages = $14, 200 pages = $24).
 */
export function calculateSinglePlanPrice(pages: number): {
  priceUsd: number;
  amountCents: number;
  maxPages: number;
  priceInr: number;
  amountPaise: number;
} {
  const clampedPages = Math.min(Math.max(pages, 20), 200);
  if (clampedPages <= 50) {
    return {
      priceUsd: 9,
      amountCents: 900,
      maxPages: clampedPages,
      priceInr: 9,
      amountPaise: 900,
    };
  }
  const extraPages = clampedPages - 50;
  const extraCost = Math.round(extraPages * 0.1);
  const totalUsd = 9 + extraCost;
  const totalCents = totalUsd * 100;
  return {
    priceUsd: totalUsd,
    amountCents: totalCents,
    maxPages: clampedPages,
    priceInr: totalUsd,
    amountPaise: totalCents,
  };
}

export const CANONICAL_PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'FREE',
    badge: 'Starter',
    priceUsd: 0,
    amountCents: 0,
    priceInr: 0,
    amountPaise: 0,
    billingType: 'free',
    currency: 'USD',
    description: 'Test the studio risk-free. Create your first book with complete core layouts.',
    features: [
      '$0 forever',
      '1 complete ebook',
      'Up to 20 pages',
      'PDF export',
      'Watermark included',
      'Standard illustration style',
    ],
    maxPagesPerBook: 20,
    maxBooksAllowed: 1,
    allowedFormats: ['pdf'],
    hasWatermark: true,
    commercialUse: false,
    enhancedIllustrations: false,
    canRegenerate: false,
    prioritySupport: false,
  },
  single: {
    id: 'single',
    name: 'ONE-TIME BOOK',
    badge: 'Custom Length',
    priceUsd: 9,
    amountCents: 900,
    priceInr: 9,
    amountPaise: 900,
    billingType: 'one_time',
    currency: 'USD',
    description: 'Perfect for publishing a single complete book. Scale from 50 to 200 pages as needed.',
    features: [
      'From $9 one-time payment',
      '1 complete ebook',
      '50 to 200 pages (scalable)',
      'PDF + EPUB exports',
      'No watermark',
      'Full commercial rights',
      'Studio-Grade Commercial Artwork',
      'Interactive revision & redesign dock',
    ],
    maxPagesPerBook: 50,
    maxBooksAllowed: 1,
    allowedFormats: ['pdf', 'epub'],
    hasWatermark: false,
    commercialUse: true,
    enhancedIllustrations: true,
    canRegenerate: true,
    prioritySupport: false,
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    badge: 'Most Popular',
    priceUsd: 19,
    amountCents: 1900,
    priceInr: 19,
    amountPaise: 1900,
    annualPriceUsd: 15, // $15/mo billed annually ($180/yr)
    annualAmountCents: 18000,
    annualPriceInr: 15,
    annualAmountPaise: 18000,
    billingType: 'subscription',
    currency: 'USD',
    description: 'For active authors, teachers, and coaches releasing continuous publication series.',
    features: [
      '15 to 20 ebooks per month',
      'Up to 100 pages per ebook',
      'PDF + EPUB exports',
      'No watermark',
      'Full commercial license',
      'Studio-Grade Commercial Artwork',
      'Priority generation queue',
      'Fast author support',
    ],
    maxPagesPerBook: 100,
    maxBooksAllowed: 20,
    allowedFormats: ['pdf', 'epub'],
    hasWatermark: false,
    commercialUse: true,
    enhancedIllustrations: true,
    canRegenerate: true,
    prioritySupport: true,
  },
  creator: {
    id: 'creator',
    name: 'CREATOR',
    badge: 'High Volume',
    priceUsd: 39,
    amountCents: 3900,
    priceInr: 39,
    amountPaise: 3900,
    annualPriceUsd: 31, // $31/mo billed annually ($372/yr)
    annualAmountCents: 37200,
    annualPriceInr: 31,
    annualAmountPaise: 37200,
    billingType: 'subscription',
    currency: 'USD',
    description: 'For publishing houses, prolific agencies, and serial digital creators producing at scale.',
    features: [
      '50 ebooks per month',
      'Up to 200 pages per ebook',
      'PDF + EPUB exports',
      'No watermark',
      'Full commercial license',
      'Publishing-Grade HD Illustrations & Covers',
      'Dedicated high-speed queue',
      '1-on-1 VIP publishing concierge',
    ],
    maxPagesPerBook: 200,
    maxBooksAllowed: 50,
    allowedFormats: ['pdf', 'epub'],
    hasWatermark: false,
    commercialUse: true,
    enhancedIllustrations: true,
    canRegenerate: true,
    prioritySupport: true,
  },
};

export const ORDERED_PLAN_IDS: PlanId[] = ['free', 'single', 'pro', 'creator'];

export function isPaidTier(planId?: string | null): boolean {
  if (!planId) return false;
  const plan = getPlan(planId);
  return Boolean(plan?.enhancedIllustrations);
}

export function getPlan(planId: string): PlanDefinition | null {
  const normalized = planId.toLowerCase().trim();
  if (normalized === 'free' || normalized === 'discovery') return CANONICAL_PLANS.free;
  if (
    normalized === 'single' ||
    normalized === 'book' ||
    normalized === 'one_time' ||
    normalized === 'book_plus' ||
    normalized === 'bookplus'
  ) {
    return CANONICAL_PLANS.single;
  }
  if (normalized === 'pro') return CANONICAL_PLANS.pro;
  if (normalized === 'creator' || normalized === 'premium') return CANONICAL_PLANS.creator;
  return null;
}
