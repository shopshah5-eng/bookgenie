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
    <section className="py-14 sm:py-20 border-t border-[#EFECE6] dark:border-[rgba(245,242,235,0.08)] bg-[#FBF9F4] dark:bg-[#12100E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] dark:text-[#F8F5EE] tracking-tight mb-2">
              My Books
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B] dark:text-[#A8A199]">
              {user && userBooks.length > 0
                ? 'Your generated books and publications, securely stored in your account.'
                : 'Your books will appear here after you create your first book.'}
            </p>
          </div>

          {user && userBooks.length > 0 && (
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A6F3C] dark:text-[#C49B66] hover:text-[#845D30] dark:hover:text-[#D4AF37] transition-colors self-start sm:self-auto"
            >
              Create another book <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Authenticated with Books */}
        {user && userBooks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Create New Book Card */}
            <button
              onClick={handleCreateNew}
              className="flex flex-col items-center justify-center h-64 sm:h-72 rounded-2xl border-2 border-dashed border-[#DDD5C7] dark:border-[#382F24] bg-white/70 dark:bg-[#181512]/70 hover:bg-white dark:hover:bg-[#1E1B17] hover:border-[#9A6F3C] dark:hover:border-[#C49B66] transition-all duration-200 group text-center p-4 active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-full bg-[#F6F1E8] dark:bg-[#28221B] group-hover:bg-[#F2E8D8] dark:group-hover:bg-[#342B21] text-[#8C5F2E] dark:text-[#D4AF37] flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-sm font-serif font-bold text-[#1A1612] dark:text-[#F8F5EE] group-hover:text-[#9A6F3C] dark:group-hover:text-[#D4AF37] transition-colors">
                Create New
              </span>
              <span className="text-xs text-[#9E968E] dark:text-[#A8A199]">Book</span>
            </button>

            {/* Real User Book Cards */}
            {userBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => router.push(`/book/${book.id}`)}
                className="flex flex-col h-64 sm:h-72 rounded-2xl bg-white dark:bg-[#1A1816] border border-[#EFECE6] dark:border-[#2C2721] hover:border-[#9A6F3C]/40 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group subpixel-card"
              >
                <div
                  className={`relative flex-1 bg-gradient-to-b ${book.coverGradient} p-4 flex flex-col justify-between overflow-hidden border-b border-[#EFECE6] dark:border-[#2C2721]`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6B635B] truncate">
                    {book.book_type}
                  </div>
                  <div className="my-auto text-center">
                    <div className="w-9 h-9 mx-auto rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-xs text-[#8C5F2E] dark:text-[#D4AF37] flex items-center justify-center mb-2 shadow-2xs">
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

                <div className="p-3 bg-white dark:bg-[#1A1816] flex items-center justify-between">
                  <div className="flex flex-col text-left truncate mr-2">
                    <span className="text-xs font-semibold text-[#1A1612] dark:text-[#F8F5EE] truncate group-hover:text-[#9A6F3C] dark:group-hover:text-[#D4AF37] transition-colors">
                      {book.title}
                    </span>
                    <span className="text-[10px] text-[#9E968E] dark:text-[#A8A199]">
                      {book.page_count} pages • {book.timeAgo}
                    </span>
                  </div>
                  <MoreVertical className="w-4 h-4 text-[#9E968E]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State (Both Logged-Out Visitors and Authenticated Users with 0 books) */}
        {(!user || userBooks.length === 0) && !loading && (
          <div className="p-8 sm:p-14 rounded-3xl bg-white dark:bg-[#1A1816] border border-[#EFECE6] dark:border-[#2C2721] flex flex-col items-center text-center max-w-xl mx-auto subpixel-card">
            <div className="w-14 h-14 rounded-full bg-[#F6F1E8] dark:bg-[#28221B] text-[#8C5F2E] dark:text-[#D4AF37] flex items-center justify-center mb-4 shadow-2xs">
              <BookOpen className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1A1612] dark:text-[#F8F5EE] mb-2">
              My Books
            </h3>
            <p className="text-sm text-[#6B635B] dark:text-[#A8A199] mb-6 max-w-md leading-relaxed">
              Your books will appear here after you create your first book.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/create">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#9A6F3C] to-[#845D30] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer">
                  <Plus className="w-4 h-4" /> Create Your First Book
                </button>
              </Link>
              <Link href="/examples/ocean-wonders">
                <button className="px-5 py-3 rounded-xl bg-[#F8F5EE] dark:bg-[#221E19] border border-[#EAE3D5] dark:border-[#382F24] text-[#1A1612] dark:text-[#F8F5EE] font-semibold text-sm hover:bg-[#F2ECE0] dark:hover:bg-[#2C2620] transition-colors cursor-pointer">
                  View Demo Book →
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
