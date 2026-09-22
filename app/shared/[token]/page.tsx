import { notFound } from 'next/navigation';
import { getServerSharedBook } from '@/lib/book/server-books';
import { SharedBookReaderClient } from '@/components/reader/SharedBookReaderClient';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const book = await getServerSharedBook(token);

  if (!book) {
    return {
      title: 'Shared Publication Not Found — BookGenie',
      description: 'The requested shared book does not exist or has been made private by its author.',
    };
  }

  return {
    title: `${book.title} — Shared Edition | BookGenie`,
    description: `Read "${book.title}" — a ${book.pageCount || book.pages.length}-page publication created with BookGenie AI publishing studio.`,
    alternates: {
      canonical: `https://bookgenie-app.netlify.app/shared/${token}`,
    },
    openGraph: {
      title: `${book.title} — Shared Edition | BookGenie`,
      description: `Read "${book.title}" created with BookGenie.`,
      url: `https://bookgenie-app.netlify.app/shared/${token}`,
      images: book.coverUrl ? [{ url: book.coverUrl }] : undefined,
    },
  };
}

export default async function SharedBookPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const book = await getServerSharedBook(token);

  if (!book) {
    notFound();
  }

  return <SharedBookReaderClient initialBook={book} token={token} />;
}
