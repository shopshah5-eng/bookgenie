import type { Metadata } from "next";
import "./globals.css";

import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  metadataBase: new URL('https://bookgenie-app.netlify.app'),
  title: "BookGenie — Turn Your Ideas Into Beautiful Books",
  description:
    "BookGenie is an autonomous publishing platform that turns a user's prompt or uploaded content into a beautifully structured, illustrated, and formatted publication with generative writing, visuals, and downloadable PDF/EPUB.",
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app',
  },
  openGraph: {
    title: "BookGenie — Turn Your Ideas Into Beautiful Books",
    description:
      "Turn your prompt or notes into a beautifully structured, illustrated, and formatted publication with downloadable PDF and EPUB.",
    url: 'https://bookgenie-app.netlify.app',
    siteName: 'BookGenie Publishing Studio',
    images: [
      {
        url: '/images/hero-calmer-you.jpg',
        width: 1200,
        height: 630,
        alt: 'BookGenie Publishing Studio',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BookGenie — Turn Your Ideas Into Beautiful Books",
    description:
      "Turn your prompt or notes into a beautifully structured, illustrated, and formatted publication.",
    images: ['/images/hero-calmer-you.jpg'],
  },
  keywords: [
    "autonomous book generator",
    "ebook creator",
    "children's book generator",
    "coloring book creator",
    "digital publishing studio",
    "PDF ebook",
    "EPUB export",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "BookGenie",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "BookGenie is a publishing studio that turns prompts and manuscripts into beautifully structured, illustrated, and formatted books."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased selection:bg-[#111111] selection:text-white bg-white text-[#111111] transition-colors duration-200 font-sans"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#111111] focus:text-white focus:rounded-full focus:shadow-lg focus:outline-none"
        >
          Skip to content
        </a>
        <div id="main-content" tabIndex={-1} className="outline-none">
          <AppProviders>
            {children}
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
