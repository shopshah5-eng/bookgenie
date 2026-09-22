import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create a Book — BookGenie AI Publishing Studio',
  description: 'Enter your prompt or outline to generate a beautifully structured, illustrated, and typeset book with BookGenie AI.',
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app/create',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
