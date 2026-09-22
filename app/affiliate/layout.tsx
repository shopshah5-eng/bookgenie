import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner & Affiliate Program — BookGenie',
  description:
    'Join the BookGenie partner program. Earn 30% recurring monthly commission on every author, educator, and publisher you refer.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/affiliate',
  },
  openGraph: {
    title: 'Partner & Affiliate Program — BookGenie',
    description: 'Earn 30% recurring monthly commission with BookGenie.',
    url: 'https://bookgenie-app.netlify.app/affiliate',
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
