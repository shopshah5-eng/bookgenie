// lib/payments/plans.ts
// Canonical single source of truth for all BookGenie plans and entitlements.
// Shared by frontend pricing UI, backend quota checks, Razorpay orders, and exports.

export type PlanId = 'free' | 'pro' | 'creator';

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
  maxBooksAllowed: number; // 1 for one-time/free, 5/mo for creator
  allowedFormats: ('pdf' | 'epub')[];
  hasWatermark: boolean;
  commercialUse: boolean;
  enhancedIllustrations: boolean;
  canRegenerate: boolean;
  prioritySupport: boolean;
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
      '1 ebook included',
      'Up to 10 pages',
      'PDF export',
      'Watermark included',
    ],
    maxPagesPerBook: 10,
    maxBooksAllowed: 1,
    allowedFormats: ['pdf'],
    hasWatermark: true,
    commercialUse: false,
    enhancedIllustrations: false,
    canRegenerate: false,
    prioritySupport: false,
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    badge: 'Most Popular',
    priceInr: 299,
    amountPaise: 29900,
    billingType: 'one_time',
    currency: 'INR',
    description: 'Full-length illustrated publication with no watermark and commercial rights.',
    features: [
      '₹299 one-time payment',
      '1 complete ebook',
      'Up to 50 pages',
      'PDF + EPUB exports',
      'No watermark',
      'Commercial use license',
      'Enhanced illustrations',
      'Regeneration & refinement dock',
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
  creator: {
    id: 'creator',
    name: 'CREATOR',
    badge: 'Unlimited Power',
    priceInr: 799,
    amountPaise: 79900,
    billingType: 'subscription',
    currency: 'INR',
    description: 'For prolific authors, educators, and creators publishing continuous volumes.',
    features: [
      '₹799 / month',
      'Up to 5 books per month',
      'Up to 100 pages per book',
      'PDF + EPUB exports',
      'No watermark',
      'Commercial use license',
      'Faster generation queue',
      'Priority author support',
    ],
    maxPagesPerBook: 100,
    maxBooksAllowed: 5,
    allowedFormats: ['pdf', 'epub'],
    hasWatermark: false,
    commercialUse: true,
    enhancedIllustrations: true,
    canRegenerate: true,
    prioritySupport: true,
  },
};

export const ORDERED_PLAN_IDS: PlanId[] = ['free', 'pro', 'creator'];

export function getPlan(planId: string): PlanDefinition | null {
  const normalized = planId.toLowerCase().trim();
  if (normalized === 'free' || normalized === 'discovery') return CANONICAL_PLANS.free;
  if (normalized === 'pro' || normalized === 'book' || normalized === 'book_plus' || normalized === 'bookplus') {
    return CANONICAL_PLANS.pro;
  }
  if (normalized === 'creator' || normalized === 'premium') return CANONICAL_PLANS.creator;
  return null;
}
