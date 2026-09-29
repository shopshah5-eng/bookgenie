'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { MinimalHeader } from '@/components/home/MinimalHeader';
import { Footer } from '@/components/landing/Footer';
import { BookOpen, ArrowRight, RotateCcw, Plus, Trash2 } from 'lucide-react';

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
          console.error('Failed to load books:', err);
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [user, authLoading]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this book?')) return;

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
    <div className="min-h-screen bg-white text-[#111111] antialiased flex flex-col selection:bg-[#F2EFE9]">
      <MinimalHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 py-12">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#F0F0F0]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight mb-2">
              My eBooks
            </h1>
            <p className="text-sm text-[#666666] font-light">
              Your books, all in one place.
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
            <div className="w-14 h-14 rounded-2xl bg-[#F7F7F6] border border-[#EAEAEA] flex items-center justify-center mx-auto mb-4 text-[#111111]">
              <BookOpen className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif text-[#111111] mb-2 font-normal">
              Sign in to view your eBooks
            </h2>
            <p className="text-sm text-[#666666] mb-6 font-light">
              Create an account or sign in to access your bookshelf and download your books.
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
            <div className="w-14 h-14 rounded-2xl bg-[#F7F7F6] border border-[#EAEAEA] flex items-center justify-center mx-auto mb-4 text-[#111111]">
              <BookOpen className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif text-[#111111] mb-2 font-normal">
              Your bookshelf is empty.
            </h2>
            <p className="text-sm text-[#666666] mb-6 font-light">
              Create your first book and it will appear here.
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-[#111111] hover:bg-[#222222] text-white text-sm font-medium transition-all shadow-xs inline-flex items-center gap-2"
            >
              <span>Create Your First eBook</span>
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
              const isEditing = book.status === 'editing';
              const isReady = book.status === 'ready';
              const isCompleted = !isGenerating && !isFailed && !isEditing;

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-[#EAEAEA] hover:border-[#D0D0CE] transition-all p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Preview */}
                    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#F7F7F6] mb-4 border border-black/5">
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
                          <span className="text-xs font-medium">Cover in Preparation</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {isGenerating && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-semibold tracking-wide backdrop-blur-xs shadow-xs">
                            Generating
                          </span>
                        )}
                        {isEditing && (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-500/90 text-white text-[10px] font-semibold tracking-wide backdrop-blur-xs shadow-xs">
                            Editing
                          </span>
                        )}
                        {(isReady || isCompleted) && (
                          <span className="px-2.5 py-1 rounded-full bg-[#111111]/85 text-white text-[10px] font-semibold tracking-wide backdrop-blur-xs shadow-xs">
                            {isReady ? 'Ready' : 'Completed'}
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
                      <span>{book.page_count || 10} pages</span>
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

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between gap-2">
                    {isGenerating && (
                      <Link
                        href={`/book/${book.id}/generating`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>View Progress</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {(isCompleted || isReady || isEditing) && (
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
                        <span>Try Again</span>
                      </Link>
                    )}

                    <button
                      onClick={(e) => handleDelete(book.id, e)}
                      disabled={deletingId === book.id}
                      className="p-2.5 rounded-xl border border-[#EAEAEA] hover:border-red-300 hover:text-red-600 text-[#888888] transition-colors cursor-pointer"
                      title="Delete book"
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

      <Footer />
    </div>
  );
}
