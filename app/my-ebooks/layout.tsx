import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My eBooks — BookGenie',
  description: 'Your created and in-progress books, all in one place.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyEbooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
