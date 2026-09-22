import { notFound } from 'next/navigation';
import { getServerBook } from '@/lib/book/server-books';
import { BookReaderClient } from '@/components/reader/BookReaderClient';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = await getServerBook(id);

  if (!book) {
    return {
      title: 'Book Not Found — BookGenie',
      description: 'The requested book publication does not exist or has not been generated.',
    };
  }

  return {
    title: `${book.title} — BookGenie AI Studio`,
    description: `Read "${book.title}" — a ${book.pageCount || book.pages.length}-page publication created with BookGenie AI publishing studio.`,
    alternates: {
      canonical: `https://bookgenie-app.netlify.app/book/${id}`,
    },
    openGraph: {
      title: `${book.title} — BookGenie AI Studio`,
      description: `Read "${book.title}" created with BookGenie.`,
      url: `https://bookgenie-app.netlify.app/book/${id}`,
      images: book.coverUrl ? [{ url: book.coverUrl }] : undefined,
    },
  };
}

export default async function BookResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getServerBook(id);

  if (!book) {
    notFound();
  }

  return <BookReaderClient initialBook={book} bookId={id} />;
}
