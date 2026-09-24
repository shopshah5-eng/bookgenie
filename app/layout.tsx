import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bookgenie-app.netlify.app'),
  title: "BookGenie — Turn Your Ideas Into Beautiful Books",
  description:
    "BookGenie is an AI publishing platform that turns a user's prompt or uploaded content into a beautifully structured, illustrated, and formatted ebook with AI-generated writing, visuals, and downloadable PDF/EPUB.",
  alternates: {
    canonical: 'https://bookgenie-app.netlify.app',
  },
  openGraph: {
    title: "BookGenie — Turn Your Ideas Into Beautiful Books",
    description:
      "Turn your prompt or notes into a beautifully structured, illustrated, and formatted publication with downloadable PDF and EPUB.",
    url: 'https://bookgenie-app.netlify.app',
    siteName: 'BookGenie AI Publishing Studio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BookGenie — Turn Your Ideas Into Beautiful Books",
    description:
      "Turn your prompt or notes into a beautifully structured, illustrated, and formatted publication.",
  },
  keywords: [
    "AI book generator",
    "ebook creator",
    "children's book generator",
    "coloring book creator",
    "AI publishing studio",
    "PDF ebook",
    "EPUB export",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('bookgenie_theme_v2');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-[#9A6F3C]/20 selection:text-[#111111] dark:selection:text-white bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F5F5F5] transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
