import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Editorial & Support — BookGenie',
  description:
    'Have a question about BookGenie, custom enterprise publishing, or account assistance? Contact our team directly.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/contact',
  },
  openGraph: {
    title: 'Contact Editorial & Support — BookGenie',
    description: 'Have a question or need assistance? Contact our team directly.',
    url: 'https://bookgenie-app.netlify.app/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
