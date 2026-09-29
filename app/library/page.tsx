'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

interface UserBookSummary {
  id: string;
  title: string;
  subtitle?: string;
  author?: string;
  cover_image_url?: string;
  status?: string;
  page_count?: number;
  created_at?: string;
  updated_at?: string;
  is_shared?: boolean;
}

function BookshelfContent() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal } = useAuth();
  const [books, setBooks] = useState<UserBookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    if (!authLoading && user) {
      fetch('/api/books')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!ignore && data) {
            setBooks(data.books || []);
          }
        })
        .catch((err) => {
          console.error('Failed to load user bookshelf:', err);
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [user, authLoading]);

  const handleDeleteBook = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this publication from your library?')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert('Failed to delete book. Please try again.');
      }
    } catch {
      alert('Network error while deleting book.');
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-2 border-secondary/40 border-t-secondary rounded-full animate-spin mb-4" />
        <p className="font-label-ui text-sm text-on-surface-variant dark:text-neutral-400">
          Loading your bookshelf...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container dark:bg-white/5 border border-surface-container-highest dark:border-white/10 flex items-center justify-center mx-auto mb-4 text-secondary dark:text-[#fcba64]">
          <span className="material-symbols-outlined text-3xl">auto_stories</span>
        </div>
        <h2 className="font-headline-sm text-2xl text-primary dark:text-[#f1effa] mb-2">
          Your Personal Bookshelf
        </h2>
        <p className="font-body-md text-sm text-on-surface-variant dark:text-neutral-400 mb-6 leading-relaxed">
          Sign in to access your saved books, generated folios, and export files.
        </p>
        <button
          onClick={() => openAuthModal('signin', '/library')}
          className="inline-flex items-center justify-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black px-7 py-3 rounded-full font-label-ui text-sm shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all font-semibold cursor-pointer"
        >
          <span>Sign In to View Books</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-surface-container-highest dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-white/5 border border-surface-container-highest dark:border-white/10 text-on-surface-variant dark:text-neutral-400 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
            <span className="font-label-caps text-label-caps tracking-widest text-on-surface dark:text-[#f1effa]">
              AUTHENTICATED ATELIER ARCHIVE
            </span>
          </div>
          <h1 className="font-display-hero text-2xl sm:text-3xl text-primary dark:text-[#f1effa] tracking-tight">
            My Bookshelf
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant dark:text-neutral-400">
            {books.length} {books.length === 1 ? 'publication' : 'publications'} saved in your account
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-primary dark:bg-white text-on-primary dark:text-black px-6 py-2.5 rounded-full font-label-ui text-sm font-semibold shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Create New Book</span>
        </Link>
      </div>

      {/* Bookshelf Grid or Empty State */}
      {books.length === 0 ? (
        <div className="text-center py-20 px-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-container dark:bg-white/5 border border-surface-container-highest dark:border-white/10 flex items-center justify-center mx-auto mb-4 text-secondary dark:text-[#fcba64]">
            <span className="material-symbols-outlined text-3xl">menu_book</span>
          </div>
          <h3 className="font-headline-sm text-xl text-primary dark:text-[#f1effa] mb-2">
            Your Bookshelf is Empty
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant dark:text-neutral-400 mb-6 leading-relaxed">
            You haven’t created any books yet. Enter your premise or manuscript in the Creation Studio to generate your first complete edition.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary dark:bg-white text-on-primary dark:text-black font-label-ui text-sm font-semibold shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer"
          >
            <span>Start Creating Now</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((b) => (
            <div
              key={b.id}
              onClick={() => router.push(`/book/${b.id}`)}
              className="group flex flex-col bg-surface-container-lowest dark:bg-[#181820] border border-surface-container-highest dark:border-white/10 rounded-xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Book Cover Frame */}
              <div className="relative w-full aspect-[3/4] bg-surface-container-high dark:bg-[#1f1f28] rounded-lg overflow-hidden mb-4 shadow-inner select-none flex items-center justify-center">
                {b.cover_image_url ? (
                  <Image
                    src={b.cover_image_url}
                    alt={b.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="p-6 text-center">
                    <span className="material-symbols-outlined text-4xl text-secondary dark:text-[#fcba64] mb-2">
                      auto_stories
                    </span>
                    <h3 className="font-title-editorial text-lg text-primary dark:text-[#f1effa] font-bold line-clamp-2">
                      {b.title}
                    </h3>
                  </div>
                )}

                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span className="font-label-caps text-[10px] uppercase bg-primary/90 dark:bg-white/90 text-on-primary dark:text-black px-2 py-0.5 rounded shadow-xs font-semibold backdrop-blur-xs">
                    {b.page_count || 16} Pages
                  </span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-sm text-base text-primary dark:text-[#f1effa] group-hover:text-secondary dark:group-hover:text-[#fcba64] transition-colors mb-1 line-clamp-1">
                    {b.title}
                  </h3>
                  {b.subtitle && (
                    <p className="font-body-sm text-xs text-on-surface-variant dark:text-neutral-400 line-clamp-1 mb-2">
                      {b.subtitle}
                    </p>
                  )}
                  <p className="font-code-spec text-[11px] text-outline dark:text-neutral-500 mb-4">
                    Created {b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-surface-container-highest dark:border-white/10">
                  <Link
                    href={`/book/${b.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-flex items-center justify-center gap-1 bg-surface-container-low dark:bg-white/5 hover:bg-surface-container dark:hover:bg-white/10 text-on-surface dark:text-[#f1effa] py-2 px-3 rounded font-label-ui text-xs font-medium border border-surface-container-highest dark:border-white/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">menu_book</span>
                    <span>Read</span>
                  </Link>

                  <a
                    href={`/api/books/${b.id}/export?format=pdf`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center p-2 rounded bg-surface-container-low dark:bg-white/5 hover:bg-surface-container dark:hover:bg-white/10 text-on-surface dark:text-[#f1effa] border border-surface-container-highest dark:border-white/10 transition-colors"
                    title="Download PDF"
                    aria-label="Download PDF"
                  >
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  </a>

                  <button
                    onClick={(e) => handleDeleteBook(b.id, e)}
                    disabled={deletingId === b.id}
                    className="inline-flex items-center justify-center p-2 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-outline hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Publication"
                    aria-label="Delete Publication"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {deletingId === b.id ? 'sync' : 'delete'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookshelfPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-surface-container-lowest dark:bg-[#121217] text-on-surface dark:text-[#f1effa] transition-colors">
        <Header />
        <main className="flex-1 flex flex-col">
          <BookshelfContent />
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
