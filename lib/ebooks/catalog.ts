// lib/ebooks/catalog.ts
// Curated Ebook Catalog for Starter Kit and Digital Product Profit Blueprint

export interface EbookProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  priceInr: number;
  originalPriceInr?: number;
  isFree: boolean;
  pageCount: number;
  coverImage: string;
  edition: string;
  author: string;
  tagline: string;
  highlights: string[];
  description: string;
  details: {
    format: string;
    fileSize: string;
    delivery: string;
    compatibility: string;
  };
}

export const EBOOK_CATALOG: Record<string, EbookProduct> = {
  'starter-kit': {
    id: 'starter-kit',
    slug: 'starter-kit',
    title: 'The First $100 Online',
    subtitle: 'A 15-Minute Overview of Making Money Selling Digital Products in 2026',
    badge: 'Free Starter Kit • 2026 Edition',
    priceInr: 0,
    originalPriceInr: 499,
    isFree: true,
    pageCount: 12,
    coverImage: '/images/ebooks/starter-kit-cover.jpg',
    edition: '2026 Free Starter Edition',
    author: 'Digital Profit Studio',
    tagline: 'Companion to The Digital Product Profit Blueprint',
    highlights: [
      'Why digital products still print money with ~90% margins in 2026',
      'The 10 digital product types that actually sell with sweet-spot pricing',
      'The 2-weekend validation test so you never build unwanted products',
      'Marketplace vs. self-hosted storefront comparison & fee breakdowns',
      'Organic traffic blueprint (Pinterest, TikTok, SEO, YouTube)',
      'The 5 fatal mistakes that keep beginners at $0',
    ],
    description:
      'Selling digital products is still one of the few businesses you can start this weekend with almost no money: no inventory, no shipping, ~90% margins, and a laptop. This free starter kit gives you the 15-minute overview — the 20% of the playbook that produces 80% of the results.',
    details: {
      format: 'Print-Ready PDF (A4)',
      fileSize: '1.2 MB',
      delivery: 'Instant Digital Download',
      compatibility: 'Any device, laptop, tablet, Kindle or phone',
    },
  },

  'blueprint': {
    id: 'blueprint',
    slug: 'blueprint',
    title: 'The Digital Product Profit Blueprint',
    subtitle: 'The Complete 2026 Manual for Making Money Selling Digital Products — Organically and With Paid Ads',
    badge: 'The Complete System • 2026 Edition',
    priceInr: 299,
    originalPriceInr: 999,
    isFree: false,
    pageCount: 96,
    coverImage: '/images/ebooks/blueprint-cover.jpg',
    edition: '2026 Complete Master Edition',
    author: 'Digital Profit Studio',
    tagline: '34 Chapters • Every Platform • 8 Illustrated Ad Setups • 90-Day Plan',
    highlights: [
      'All 34 Chapters across 6 Master Parts — The complete A-to-Z playbook',
      'Platform fee cheat sheet comparing 30+ storefronts (Gumroad, Payhip, Shopify, Etsy, KDP)',
      'Full organic playbooks: TikTok SEO, Pinterest visual engine, LinkedIn, and Reddit',
      'Illustrated ad setups: Step-by-step Meta (Facebook + Instagram), Google Search, TikTok, & Pinterest',
      'The Value Ladder Funnel: Turn a $29 offer into $2,000+ customer lifetime value',
      'The Week-by-Week 90-Day Action Plan from day 1 to $1,500–$4,000/month',
    ],
    description:
      'The definitive 2026 manual for building a sustainable digital product empire. Spans every phase from idea validation, low-stress production, and multi-tier pricing, to organic content flywheels, paid ad testing gates, and automated email funnel architecture.',
    details: {
      format: 'High-Resolution PDF (96 Pages)',
      fileSize: '4.8 MB',
      delivery: 'Instant Digital Download + Sent to Email',
      compatibility: 'Mobile, Tablet, Desktop, Kindle',
    },
  },
};
