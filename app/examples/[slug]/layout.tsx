import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ocean Wonders — 16-Page Illustrated Demonstration Book | BookGenie',
  description:
    'Explore Ocean Wonders, a complete 16-page children’s storybook created with BookGenie AI. Read online or download high-fidelity sample PDF and EPUB exports.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/examples/ocean-wonders',
  },
  openGraph: {
    title: 'Ocean Wonders — 16-Page Illustrated Demonstration Book | BookGenie',
    description:
      'Explore Ocean Wonders, a complete 16-page children’s storybook created with BookGenie AI. Read online or download high-fidelity sample PDF and EPUB exports.',
    url: 'https://bookgenie-app.netlify.app/examples/ocean-wonders',
  },
};

export default function ExampleSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
