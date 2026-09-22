import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How BookGenie Works — Architecture & AI Publishing Pipeline',
  description:
    'Learn how BookGenie turns an idea or document into a complete, illustrated, professionally typeset book using our multi-tier AI pipeline and deterministic layout engine.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/how-it-works',
  },
  openGraph: {
    title: 'How BookGenie Works — Architecture & AI Publishing Pipeline',
    description:
      'Learn how BookGenie turns an idea or document into a complete, illustrated, professionally typeset book.',
    url: 'https://bookgenie-app.netlify.app/how-it-works',
  },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
