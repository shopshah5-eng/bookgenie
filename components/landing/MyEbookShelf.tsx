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

  // Curated showcase books for logged-out preview
  const showcaseBooks: BookSummary[] = [
    {
      id: 'demo-mindful-morning',
      title: 'The Mindful Morning',
      book_type: 'journal',
      page_count: 72,
      timeAgo: '3 days ago',
      coverGradient: 'from-[#EDE6D6] to-[#D9CEBA]',
    },
    {
      id: 'demo-cute-animals',
      title: 'Cute Animals Coloring Book',
      book_type: 'coloring',
      page_count: 36,
      timeAgo: '1 week ago',
      coverGradient: 'from-[#F7EDE2] to-[#E5C9AF]',
    },
    {
      id: 'demo-digital-marketing',
      title: 'Digital Marketing Made Simple',
      book_type: 'guide',
      page_count: 58,
      timeAgo: '1 week ago',
      coverGradient: 'from-[#D8E2DC] to-[#B2C5B8]',
    },
    {
      id: 'demo-ancient-civilizations',
      title: 'Ancient Civilizations',
      book_type: 'history',
      page_count: 95,
      timeAgo: '2 weeks ago',
      coverGradient: 'from-[#E8DCCB] to-[#C9B9A3]',
    },
    {
      id: 'demo-healthy-recipes',
      title: 'Healthy Recipes',
      book_type: 'recipe',
      page_count: 42,
      timeAgo: '2 weeks ago',
      coverGradient: 'from-[#EAE4D9] to-[#CDC5B8]',
    },
  ];

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
          .limit(5);

        if (!error && data && data.length > 0) {
          const formatted: BookSummary[] = data.map((b) => ({
            id: b.id,
            title: b.title,
            book_type: b.book_type,
            page_count: b.page_count || 20,
            timeAgo: 'Recent',
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

  const displayedBooks = user && userBooks.length > 0 ? userBooks : showcaseBooks;

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
              My Ebook
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B]">
              Your recently created books, all in one place.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9A6F3C] hover:text-[#845D30] transition-colors self-start sm:self-auto"
          >
            View all my books <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Book Shelf Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
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

          {/* Book Cards */}
          {displayedBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => {
                if (user && userBooks.some((b) => b.id === book.id)) {
                  router.push(`/book/${book.id}`);
                } else if (book.id === 'demo-cute-animals' || book.id === 'demo-mindful-morning') {
                  router.push('/examples/ocean-wonders');
                } else {
                  handleCreateNew();
                }
              }}
              className="flex flex-col h-64 sm:h-72 rounded-2xl bg-white border border-[#EFECE6] hover:border-[#9A6F3C]/40 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group"
            >
              {/* Book Cover Presentation */}
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

              {/* Book Details Footer */}
              <div className="p-3 bg-white flex items-center justify-between">
                <div className="flex flex-col text-left truncate mr-2">
                  <span className="text-xs font-semibold text-[#1A1612] truncate group-hover:text-[#9A6F3C] transition-colors">
                    {book.title}
                  </span>
                  <span className="text-[10px] text-[#9E968E]">
                    {book.page_count} pages • {book.timeAgo}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1 text-[#9E968E] hover:text-[#1A1612] rounded-lg"
                  aria-label="Book actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
