import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Showcase & Examples — Books Created with BookGenie',
  description:
    'Browse our curated gallery of books created with BookGenie, including illustrated children books, workbooks, practical guides, cookbooks, and fiction.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/examples',
  },
  openGraph: {
    title: 'Showcase & Examples — Books Created with BookGenie',
    description:
      'Browse our curated gallery of books created with BookGenie.',
    url: 'https://bookgenie-app.netlify.app/examples',
  },
};

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
