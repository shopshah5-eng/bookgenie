import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy & Guarantee — BookGenie',
  description: 'BookGenie 7-day money-back satisfaction guarantee and refund process for all Creator and Pro subscriptions.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/refund',
  },
};

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
