// app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import type { BookDocument } from '@/lib/book/types';

export function getOceanWondersDemoBook(): BookDocument {
  return {
    schemaVersion: 1,
    id: 'demo-ocean-wonders',
    userId: 'public-demo-user',
    title: 'Ocean Wonders',
    subtitle: 'An Underwater Journey Through Coral Reefs & Deep Blue Mysteries',
    bookType: 'children',
    language: 'English',
    style: 'Storybook Illustration',
    pageCount: 16,
    coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blueprint: {
      title: 'Ocean Wonders',
      subtitle: 'An Underwater Journey Through Coral Reefs & Deep Blue Mysteries',
      bookType: 'children',
      audience: 'Children & Family Readers',
      language: 'English',
      style: 'Storybook Illustration',
      pageTarget: 16,
      chapters: [
        { index: 1, title: 'The Sunlit Shallows', summary: 'Meeting Barnaby the sea turtle.', allocatedPages: 4 },
        { index: 2, title: 'The Coral Kingdom', summary: 'Exploring vibrant anemones and neon fish.', allocatedPages: 4 },
        { index: 3, title: 'Secrets of the Trench', summary: 'Bioluminescent wonders in the twilight zone.', allocatedPages: 4 },
        { index: 4, title: 'Journey Home with the Current', summary: 'Riding the warm Gulf Stream back home.', allocatedPages: 4 },
      ],
      visualPlan: [
        { pageNumber: 1, visualType: 'cover', promptSpec: 'Majestic sea turtle swimming over illuminated coral reef.', layout: 'full-bleed' },
        { pageNumber: 4, visualType: 'illustration', promptSpec: 'Close up of a friendly sea turtle with warm morning rays through turquoise water.', layout: 'image-right' },
        { pageNumber: 8, visualType: 'illustration', promptSpec: 'Schools of vibrant neon clownfish dancing through anemone garden.', layout: 'image-top' },
        { pageNumber: 13, visualType: 'illustration', promptSpec: 'Glowing bioluminescent jellyfish in the deep indigo waters.', layout: 'image-bottom' },
      ],
      characterBible: {
        protagonist: 'Barnaby: A wise, friendly green sea turtle with moss-tinted shell and bright inquisitive eyes.',
      },
    },
    pages: [
      {
        pageNumber: 1,
        chapterIndex: 1,
        title: 'Title & Cover',
        pageType: 'cover',
        layout: 'full-bleed',
        blocks: [
          { id: 'p1-1', type: 'heading', level: 1, text: 'Ocean Wonders' },
          { id: 'p1-2', type: 'quote', text: '“The sea, once it casts its spell, holds one in its net of wonder forever.”' },
          { id: 'p1-3', type: 'paragraph', text: 'Created with BookGenie Editorial Studio' },
        ],
      },
      {
        pageNumber: 2,
        chapterIndex: 1,
        title: 'Prologue: The Sunlit Shallows',
        pageType: 'chapter_header',
        layout: 'standard',
        blocks: [
          { id: 'p2-1', type: 'heading', level: 1, text: 'Chapter 1: The Sunlit Shallows' },
          {
            id: 'p2-2',
            type: 'paragraph',
            text: 'Just beneath the gentle waves of Sapphire Bay, the morning sun poured through the clear turquoise water like golden ribbons. Here lived Barnaby, a green sea turtle who had seen seventy summers pass over the reef.',
          },
          {
            id: 'p2-3',
            type: 'paragraph',
            text: 'Every sunrise, Barnaby would stretch his flippers, take a deep breath of crisp sea air at the surface, and prepare for another expedition into the secret gardens of the ocean.',
          },
        ],
      },
      {
        pageNumber: 3,
        chapterIndex: 1,
        title: 'The Great Barrier Reef Garden',
        pageType: 'illustrated_content',
        layout: 'image-right',
        blocks: [
          { id: 'p3-1', type: 'heading', level: 2, text: 'The Living City' },
          {
            id: 'p3-2',
            type: 'paragraph',
            text: 'A coral reef is not merely stone or plant—it is a bustling metropolis built by millions of tiny coral polyps over centuries. Brain corals carved winding highways, while purple sea fans swayed gently with the incoming tide.',
          },
          {
            id: 'p3-3',
            type: 'paragraph',
            text: '“Notice how every creature has its home,” Barnaby would say to the curious yellow tangs following in his wake. “From the tiny porcelain crab to the giant manta ray, the sea provides for all who respect its balance.”',
          },
          {
            id: 'p3-img',
            type: 'image',
            caption: 'Barnaby gliding through the sun-dappled turquoise water above the coral reef.',
          },
        ],
      },
      {
        pageNumber: 4,
        chapterIndex: 1,
        title: 'Whispers of the Current',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'p4-1', type: 'heading', level: 3, text: 'Ocean Secrets' },
          {
            id: 'p4-2',
            type: 'list',
            items: [
              'Sea turtles can navigate thousands of miles across oceans using Earth’s magnetic field.',
              'Over 25% of all marine life depends on healthy coral reefs for shelter and food.',
              'The oceans generate more than half of the world’s oxygen and absorb vast amounts of carbon.',
            ],
          },
          {
            id: 'p4-3',
            type: 'paragraph',
            text: 'Barnaby knew that tomorrow’s tide would carry him toward the mysterious Deep Trench, where creatures carried their own lights in the darkness...',
          },
        ],
      },
    ],
  };
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (id === 'ocean-wonders' || id === 'demo-ocean-wonders') {
      return NextResponse.json(getOceanWondersDemoBook());
    }

    // 1. Query Supabase PostgreSQL
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin');
      const supabase = createAdminClient();
      const { data: dbBook } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (dbBook) {
        const { data: dbPages } = await supabase
          .from('book_pages')
          .select('*')
          .eq('book_id', id)
          .order('page_number', { ascending: true });

        const doc: BookDocument = {
          schemaVersion: 1,
          id: dbBook.id,
          userId: dbBook.user_id,
          title: dbBook.title,
          subtitle: dbBook.subtitle || undefined,
          bookType: dbBook.book_type,
          language: dbBook.language || 'English',
          style: dbBook.style || 'Modern',
          pageCount: dbBook.page_count || dbPages?.length || 0,
          coverUrl: dbBook.blueprint?.visualPlan?.[0]?.url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          blueprint: dbBook.blueprint || {
            title: dbBook.title,
            bookType: dbBook.book_type,
            audience: 'General Readers',
            language: dbBook.language,
            style: dbBook.style,
            pageTarget: dbBook.page_target || 16,
            chapters: [],
            visualPlan: [],
          },
          pages: (dbPages || []).map((p) => ({
            pageNumber: p.page_number,
            chapterIndex: p.chapter_index,
            title: p.title,
            pageType: p.page_type,
            layout: p.layout,
            blocks: p.blocks,
          })),
          versionNumber: dbBook.version_number || 1,
          isShared: dbBook.is_shared,
          shareToken: dbBook.share_token,
          createdAt: dbBook.created_at,
          updatedAt: dbBook.updated_at,
        };

        return NextResponse.json(doc);
      }
    } catch (dbErr) {
      console.warn('Supabase fetch error, checking dev store:', dbErr);
    }

    // 2. Check local dev memory store
    const book = GenerationPipeline.getBook(id);
    if (book) {
      return NextResponse.json(book);
    }

    return NextResponse.json(
      { error: 'Book not found.' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Book not found.' },
      { status: 404 }
    );
  }
}
