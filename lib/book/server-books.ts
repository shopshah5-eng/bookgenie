import { createAdminClient } from '@/lib/supabase/admin';
import type { BookDocument, BookPageDocument } from '@/lib/book/types';
import { getOceanWondersDemoBook } from '@/lib/book/demo-book';

export async function getServerBook(id: string): Promise<BookDocument | null> {
  if (id === 'ocean-wonders' || id === 'demo-ocean-wonders') {
    return getOceanWondersDemoBook();
  }

  try {
    const supabase = createAdminClient();
    const { data: dbBook, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (bookError || !dbBook) {
      return null;
    }

    const { data: dbPages, error: pagesError } = await supabase
      .from('book_pages')
      .select('*')
      .eq('book_id', id)
      .order('page_number', { ascending: true });

    if (pagesError || !dbPages || dbPages.length === 0) {
      return null;
    }

    const pages: BookPageDocument[] = dbPages.map((p) => ({
      pageNumber: p.page_number,
      chapterIndex: p.chapter_index,
      title: p.title,
      pageType: p.page_type,
      layout: p.layout,
      blocks: p.blocks || [],
    }));

    return {
      schemaVersion: 1,
      id: dbBook.id,
      userId: dbBook.user_id,
      title: dbBook.title,
      subtitle: dbBook.subtitle,
      bookType: dbBook.book_type,
      language: dbBook.language,
      style: dbBook.style,
      pageCount: dbBook.page_count,
      coverUrl: dbBook.cover_url,
      blueprint: dbBook.blueprint,
      versionNumber: dbBook.version_number,
      isShared: dbBook.is_shared,
      shareToken: dbBook.share_token,
      pages,
      createdAt: dbBook.created_at,
      updatedAt: dbBook.updated_at,
    };
  } catch (err) {
    console.error('getServerBook error:', err);
    return null;
  }
}

export async function getServerSharedBook(token: string): Promise<BookDocument | null> {
  if (token === 'ocean-wonders' || token === 'demo-ocean-wonders') {
    return getOceanWondersDemoBook();
  }

  try {
    const supabase = createAdminClient();
    const { data: dbBook, error: bookError } = await supabase
      .from('books')
      .select('*')
      .or(`share_token.eq.${token},id.eq.${token}`)
      .eq('is_shared', true)
      .maybeSingle();

    if (bookError || !dbBook) {
      return null;
    }

    const { data: dbPages, error: pagesError } = await supabase
      .from('book_pages')
      .select('*')
      .eq('book_id', dbBook.id)
      .order('page_number', { ascending: true });

    if (pagesError || !dbPages || dbPages.length === 0) {
      return null;
    }

    const pages: BookPageDocument[] = dbPages.map((p) => ({
      pageNumber: p.page_number,
      chapterIndex: p.chapter_index,
      title: p.title,
      pageType: p.page_type,
      layout: p.layout,
      blocks: p.blocks || [],
    }));

    return {
      schemaVersion: 1,
      id: dbBook.id,
      userId: dbBook.user_id,
      title: dbBook.title,
      subtitle: dbBook.subtitle,
      bookType: dbBook.book_type,
      language: dbBook.language,
      style: dbBook.style,
      pageCount: dbBook.page_count,
      coverUrl: dbBook.cover_url,
      blueprint: dbBook.blueprint,
      versionNumber: dbBook.version_number,
      isShared: true,
      shareToken: dbBook.share_token,
      pages,
      createdAt: dbBook.created_at,
      updatedAt: dbBook.updated_at,
    };
  } catch (err) {
    console.error('getServerSharedBook error:', err);
    return null;
  }
}
