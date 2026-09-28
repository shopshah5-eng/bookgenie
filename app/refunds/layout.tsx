import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy — BookGenie',
  description: 'Understand the BookGenie refund policy for digital books, generation guarantees, and subscription cancellations.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/refunds',
  },
};

export default function RefundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
