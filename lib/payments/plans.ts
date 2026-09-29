// lib/payments/plans.ts
// Canonical single source of truth for all BookGenie plans and entitlements.
// Shared by frontend pricing UI, backend quota checks, Razorpay orders, and exports.

export type PlanId = 'free' | 'single' | 'pro' | 'creator';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  badge?: string;
  priceInr: number;
  amountPaise: number;
  billingType: 'free' | 'one_time' | 'subscription';
  currency: 'INR';
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
  annualPriceInr?: number;
  annualAmountPaise?: number;
}

/**
 * Calculates dynamic price for Single Book plan based on page count.
 * Base: ₹299 for up to 50 pages.
 * Beyond 50 pages: +₹2 per extra page (e.g., 100 pages = ₹399, 200 pages = ₹599).
 */
export function calculateSinglePlanPrice(pages: number): { priceInr: number; amountPaise: number; maxPages: number } {
  const clampedPages = Math.min(Math.max(pages, 20), 200);
  if (clampedPages <= 50) {
    return { priceInr: 299, amountPaise: 29900, maxPages: clampedPages };
  }
  const extraPages = clampedPages - 50;
  const extraCost = Math.round(extraPages * 2);
  const totalInr = 299 + extraCost;
  return { priceInr: totalInr, amountPaise: totalInr * 100, maxPages: clampedPages };
}

export const CANONICAL_PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'FREE',
    badge: 'Starter',
    priceInr: 0,
    amountPaise: 0,
    billingType: 'free',
    currency: 'INR',
    description: 'Test the studio risk-free. Create your first book with complete core layouts.',
    features: [
      '₹0 forever',
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
    priceInr: 299,
    amountPaise: 29900,
    billingType: 'one_time',
    currency: 'INR',
    description: 'Perfect for publishing a single complete book. Scale from 50 to 200 pages as needed.',
    features: [
      'From ₹299 one-time payment',
      '1 complete ebook',
      '50 to 200 pages (scalable)',
      'PDF + EPUB exports',
      'No watermark',
      'Full commercial rights',
      'Google Gemini Ultra-HD Artworks',
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
    priceInr: 999,
    amountPaise: 99900,
    annualPriceInr: 799, // ₹799/mo billed annually
    annualAmountPaise: 958800,
    billingType: 'subscription',
    currency: 'INR',
    description: 'For active authors, teachers, and coaches releasing continuous publication series.',
    features: [
      '15 to 20 ebooks per month',
      'Up to 100 pages per ebook',
      'PDF + EPUB exports',
      'No watermark',
      'Full commercial license',
      'Google Gemini Ultra-HD Artworks',
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
    priceInr: 1999,
    amountPaise: 199900,
    annualPriceInr: 1599, // ₹1599/mo billed annually
    annualAmountPaise: 1918800,
    billingType: 'subscription',
    currency: 'INR',
    description: 'For publishing houses, prolific agencies, and serial digital creators producing at scale.',
    features: [
      '50 ebooks per month',
      'Up to 200 pages per ebook',
      'PDF + EPUB exports',
      'No watermark',
      'Full commercial license',
      'Google Gemini Studio-Grade Artworks',
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
