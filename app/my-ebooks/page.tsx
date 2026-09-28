'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { BookOpen, Clock, Download, ArrowRight, RotateCcw, Plus, Trash2 } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  subtitle?: string;
  cover_url?: string;
  cover_image_url?: string;
  status?: string;
  page_count?: number;
  created_at?: string;
}

export default function MyEbooksPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal, signOut } = useAuth();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setIsLoading(false);
      return;
    }

    if (user) {
      fetchBooks();
    }
  }, [user, authLoading]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this publication?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete book:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased flex flex-col selection:bg-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#0000000d]">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group select-none">
            <svg
              className="w-5 h-5 text-[#111111]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 1-4 4v14a3 3 0 0 0 3-3h7z" />
            </svg>
            <span className="font-semibold text-lg tracking-tight text-[#111111]">
              BookGenie
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors py-1"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors py-1"
            >
              Pricing
            </Link>
            <Link
              href="/my-ebooks"
              className="relative text-[14px] font-medium text-[#111111] transition-colors py-1"
            >
              My eBooks
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
            </Link>
          </nav>

          {/* Right: User Avatar */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F2EFE9] text-[#111111] flex items-center justify-center text-xs font-semibold select-none border border-[#EAEAEA]">
                  {(user.email?.[0] || 'U').toUpperCase()}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-[#888888] hover:text-[#111111] transition-colors hidden sm:inline-block"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="text-[13px] font-medium px-4 py-1.5 rounded-full border border-[#EAEAEA] text-[#111111] hover:border-[#111111] transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 py-12">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#F0F0F0]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight mb-2">
              My eBooks
            </h1>
            <p className="text-sm text-[#666666]">
              All your generated and in-progress publications.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-medium transition-all shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New eBook</span>
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#111111] rounded-full animate-spin mb-4" />
            <p className="text-xs text-[#888888]">Loading your eBooks...</p>
          </div>
        )}

        {/* Unauthenticated State */}
        {!authLoading && !user && !isLoading && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-[#111111]">
              <BookOpen className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif text-[#111111] mb-2 font-normal">
              Sign in to view your eBooks
            </h2>
            <p className="text-sm text-[#666666] mb-6">
              Create an account or sign in to access all your generated books and downloads.
            </p>
            <button
              onClick={() => openAuthModal('signin')}
              className="px-6 py-3 rounded-full bg-[#111111] hover:bg-[#222222] text-white text-sm font-medium transition-all shadow-xs cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && user && books.length === 0 && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-[#111111]">
              <BookOpen className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif text-[#111111] mb-2 font-normal">
              No eBooks generated yet
            </h2>
            <p className="text-sm text-[#666666] mb-6">
              Describe your idea on the homepage and generate your first complete eBook in minutes.
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-[#111111] hover:bg-[#222222] text-white text-sm font-medium transition-all shadow-xs inline-flex items-center gap-2"
            >
              <span>Generate Your eBook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {books.map((book) => {
              const coverUrl = book.cover_url || book.cover_image_url;
              const isGenerating =
                book.status === 'queued' ||
                book.status === 'planning' ||
                book.status === 'metadata' ||
                book.status === 'cover' ||
                book.status === 'writing' ||
                book.status === 'illustrations' ||
                book.status === 'designing' ||
                book.status === 'finalizing';
              const isFailed = book.status === 'failed';
              const isCompleted = !isGenerating && !isFailed;

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-[#EAEAEA] hover:border-[#CCCCCC] transition-all p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Preview */}
                    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 mb-4 border border-black/5">
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={book.title}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 380px"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#888888]">
                          <BookOpen className="w-8 h-8 stroke-[1.5] mb-2" />
                          <span className="text-xs font-medium">Cover Generating</span>
                        </div>
                      )}

                      {/* Status Badge Overlay */}
                      <div className="absolute top-3 right-3">
                        {isGenerating && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-semibold tracking-wide backdrop-blur-xs shadow-xs">
                            Generating
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-1 rounded-full bg-[#111111]/85 text-white text-[10px] font-semibold tracking-wide backdrop-blur-xs shadow-xs">
                            Completed
                          </span>
                        )}
                        {isFailed && (
                          <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-semibold tracking-wide backdrop-blur-xs shadow-xs">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Book Info */}
                    <h3 className="font-serif text-lg font-normal text-[#111111] line-clamp-1 mb-1">
                      {book.title}
                    </h3>
                    {book.subtitle && (
                      <p className="text-xs text-[#777777] line-clamp-1 mb-2">
                        {book.subtitle}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-[#888888] font-medium mb-4">
                      <span>{book.page_count || 30} pages</span>
                      <span>•</span>
                      <span>
                        {book.created_at
                          ? new Date(book.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {/* Actions according to Section 16 */}
                  <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between gap-2">
                    {isGenerating && (
                      <Link
                        href={`/book/${book.id}/generating`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Continue Viewing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {isCompleted && (
                      <Link
                        href={`/book/${book.id}/preview`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Open Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {isFailed && (
                      <Link
                        href={`/book/${book.id}/generating`}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry</span>
                      </Link>
                    )}

                    <button
                      onClick={(e) => handleDelete(book.id, e)}
                      disabled={deletingId === book.id}
                      className="p-2.5 rounded-xl border border-[#EAEAEA] hover:border-red-300 hover:text-red-600 text-[#888888] transition-colors"
                      title="Delete publication"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <AuthModal />
    </div>
  );
}
