import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Publishing Plans — BookGenie',
  description:
    'Simple, transparent pricing for BookGenie AI publishing studio. Start free or choose Creator and Pro plans for unlimited books, custom exports, and commercial rights.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/pricing',
  },
  openGraph: {
    title: 'Pricing & Publishing Plans — BookGenie',
    description:
      'Simple, transparent pricing for BookGenie AI publishing studio. Start free or choose Creator and Pro plans.',
    url: 'https://bookgenie-app.netlify.app/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
