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
  title: "BookGenie — Turn Your Ideas Into Beautiful Books",
  description:
    "BookGenie is an AI publishing platform that turns a user's prompt or uploaded content into a beautifully structured, illustrated, and formatted ebook with AI-generated writing, visuals, and downloadable PDF/EPUB.",
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
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="antialiased selection:bg-[#9A6F3C]/20 selection:text-[#1A1612]">
        {children}
      </body>
    </html>
  );
}
