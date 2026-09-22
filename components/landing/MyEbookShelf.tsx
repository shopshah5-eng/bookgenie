'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Plus, MoreVertical, BookOpen, ArrowRight } from 'lucide-react';

interface BookSummary {
  id: string;
  title: string;
  book_type: string;
  page_count: number;
  timeAgo: string;
  coverGradient: string;
  coverImage?: string;
}

export function MyEbookShelf() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [userBooks, setUserBooks] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserBooks = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('books')
          .select('id, title, book_type, page_count, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(8);

        if (!error && data && data.length > 0) {
          const formatted: BookSummary[] = data.map((b) => ({
            id: b.id,
            title: b.title,
            book_type: b.book_type,
            page_count: b.page_count || 16,
            timeAgo: new Date(b.created_at).toLocaleDateString(),
            coverGradient: 'from-[#F5EFE4] to-[#E6DCC9]',
          }));
          setUserBooks(formatted);
        }
      } catch {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, [user]);

  const handleCreateNew = () => {
    if (!user) {
      openAuthModal('signup', '/create');
    } else {
      router.push('/create');
    }
  };

  return (
    <section className="py-14 sm:py-20 border-t border-[#EFECE6] bg-[#FBF9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] tracking-tight mb-2">
              {user ? 'My Bookshelf' : 'Your Personal Library'}
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B]">
              {user
                ? 'Your generated books and publications, securely stored in your account.'
                : 'Sign in to access your saved books, or generate your first book in minutes.'}
            </p>
          </div>

          {user && userBooks.length > 0 && (
            <button
              onClick={() => router.push('/create')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A6F3C] hover:text-[#845D30] transition-colors self-start sm:self-auto"
            >
              Create another book <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Authenticated with Books */}
        {user && userBooks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Create New Book Card */}
            <button
              onClick={handleCreateNew}
              className="flex flex-col items-center justify-center h-64 sm:h-72 rounded-2xl border-2 border-dashed border-[#DDD5C7] bg-white/70 hover:bg-white hover:border-[#9A6F3C] transition-all duration-200 group text-center p-4 active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-full bg-[#F6F1E8] group-hover:bg-[#F2E8D8] text-[#8C5F2E] flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-sm font-serif font-bold text-[#1A1612] group-hover:text-[#9A6F3C] transition-colors">
                Create New
              </span>
              <span className="text-xs text-[#9E968E]">Book</span>
            </button>

            {/* Real User Book Cards */}
            {userBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => router.push(`/book/${book.id}`)}
                className="flex flex-col h-64 sm:h-72 rounded-2xl bg-white border border-[#EFECE6] hover:border-[#9A6F3C]/40 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group"
              >
                <div
                  className={`relative flex-1 bg-gradient-to-b ${book.coverGradient} p-4 flex flex-col justify-between overflow-hidden border-b border-[#EFECE6]`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6B635B] truncate">
                    {book.book_type}
                  </div>
                  <div className="my-auto text-center">
                    <div className="w-9 h-9 mx-auto rounded-full bg-white/80 backdrop-blur-xs text-[#8C5F2E] flex items-center justify-center mb-2 shadow-2xs">
                      <BookOpen className="w-4 h-4 stroke-[2]" />
                    </div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1A1612] leading-snug line-clamp-2">
                      {book.title}
                    </h4>
                  </div>
                  <div className="text-[9px] text-[#8C8275] text-center font-serif italic">
                    BookGenie
                  </div>
                </div>

                <div className="p-3 bg-white flex items-center justify-between">
                  <div className="flex flex-col text-left truncate mr-2">
                    <span className="text-xs font-semibold text-[#1A1612] truncate group-hover:text-[#9A6F3C] transition-colors">
                      {book.title}
                    </span>
                    <span className="text-[10px] text-[#9E968E]">
                      {book.page_count} pages • {book.timeAgo}
                    </span>
                  </div>
                  <MoreVertical className="w-4 h-4 text-[#9E968E]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Authenticated but Empty Shelf */}
        {user && userBooks.length === 0 && !loading && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EFECE6] text-center flex flex-col items-center max-w-xl mx-auto shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-[#F6F1E8] text-[#8C5F2E] flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1A1612] mb-2">
              Your Bookshelf is Empty
            </h3>
            <p className="text-sm text-[#6B635B] mb-6 max-w-md">
              You haven't generated any books yet. Enter a prompt or topic to create your very first AI-crafted ebook.
            </p>
            <button
              onClick={() => router.push('/create')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#9A6F3C] to-[#845D30] text-white font-medium text-sm shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" /> Create Your First Book
            </button>
          </div>
        )}

        {/* Logged Out / Visitor View: Authentic Preview Card */}
        {!user && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EFECE6] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xs">
            <div className="max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EDE0] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold tracking-wider uppercase mb-3">
                Cloud Library
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1612] mb-2">
                Start building your AI publication catalogue
              </h3>
              <p className="text-sm sm:text-base text-[#6B635B] leading-relaxed mb-6">
                All books you generate are privately linked to your account, rendered in high-resolution PDF and reflowable EPUB3, and saved to your personal library.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openAuthModal('signup', '/create')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A6F3C] to-[#845D30] text-white font-medium text-sm hover:shadow-sm transition-all"
                >
                  Get Started Free
                </button>
                <Link
                  href="/examples/ocean-wonders"
                  className="px-5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#EAE3D5] text-[#1A1612] font-medium text-sm hover:bg-[#F2ECE0] transition-colors"
                >
                  Inspect Ocean Wonders Demo →
                </Link>
              </div>
            </div>

            <div className="w-full md:w-72 p-5 rounded-2xl bg-gradient-to-b from-[#FAF7F0] to-[#EFE8DC] border border-[#E6DDCE] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white text-[#8C5F2E] flex items-center justify-center mb-3 shadow-xs">
                <BookOpen className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-xs font-semibold text-[#8C5F2E] uppercase tracking-wider mb-1">
                Zero Placeholder Policy
              </span>
              <h4 className="text-base font-serif font-bold text-[#1A1612] mb-1.5">
                100% Real Live Generation
              </h4>
              <p className="text-xs text-[#6B635B] leading-relaxed">
                BookGenie never seeds fake generated books into your account. Only books you write and prompt appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
