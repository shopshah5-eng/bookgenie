import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service & Commercial Rights — BookGenie',
  description: 'Terms of service, usage guidelines, commercial publishing rights, and ownership rules for BookGenie users and creators.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
