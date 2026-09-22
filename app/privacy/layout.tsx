import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — BookGenie',
  description: 'Learn how BookGenie collects, protects, and manages your account information, source files, and generated content.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
