import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — BookGenie',
  description:
    'Common questions about BookGenie AI book creation, EPUB/PDF export specifications, Amazon KDP compatibility, copyright, and commercial rights.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions — BookGenie',
    description: 'Frequently asked questions about BookGenie AI book publishing.',
    url: 'https://bookgenie-app.netlify.app/faq',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
