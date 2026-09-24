import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDemoBook } from '@/lib/book/demo-book';
import { ExampleBookReader } from '@/components/reader/ExampleBookReader';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getDemoBook(slug);

  if (!book) {
    return {
      title: 'Book Not Found | BookGenie Showcase',
      description: 'The requested demonstration book could not be found.',
    };
  }

  return {
    title: `${book.title} — ${book.pages.length}-Page Interactive Edition | BookGenie Showcase`,
    description: `${book.subtitle || book.title}. Explore the full interactive preview typeset and illustrated with BookGenie AI Studio.`,
    openGraph: {
      title: `${book.title} | BookGenie Showcase`,
      description: book.subtitle || book.title,
      images: [
        {
          url: book.coverUrl || '/images/hero-brighter-you.jpg',
          width: 1200,
          height: 630,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} | BookGenie Showcase`,
      description: book.subtitle || book.title,
      images: [book.coverUrl || '/images/hero-brighter-you.jpg'],
    },
  };
}

export default async function ExampleBookPreview({ params }: PageProps) {
  const { slug } = await params;
  const book = getDemoBook(slug);

  if (!book) {
    notFound();
  }

  return <ExampleBookReader book={book} />;
}
