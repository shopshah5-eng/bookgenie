// app/api/books/create/route.ts
// Secure book creation and generation endpoint with authentication, schema validation, and plan quota enforcement

import { NextRequest, NextResponse } from 'next/server';
import { GenerationPipeline } from '@/lib/ai/pipeline';
import { AICostController } from '@/lib/ai/cost-controller';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { BookType } from '@/lib/book/types';

const ALLOWED_BOOK_TYPES: string[] = [
  'auto',
  'children',
  'novel',
  'coloring',
  'course',
  'guide',
  'workbook',
  'recipe',
  'history',
  'journal',
];

const ALLOWED_LANGUAGES: string[] = [
  'english',
  'spanish',
  'french',
  'german',
  'hindi',
  'japanese',
  'italian',
  'portuguese',
  'mandarin',
];

const ALLOWED_STYLES: string[] = [
  'modern',
  'editorial',
  'playful',
  'academic',
  'minimal',
  'vintage',
  'whimsical',
];

export async function POST(req: NextRequest) {
  try {
    // 1. Safe JSON parsing (handles malformed JSON / null body with 400 instead of 500)
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'INVALID_JSON', message: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'INVALID_BODY', message: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    const {
      prompt,
      bookType = 'auto',
      language = 'english',
      style = 'modern',
      uploadedContext,
      pageTarget = 16,
    } = body;

    // 2. Strict Input Validation
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'INVALID_PROMPT', message: 'A book prompt string is required.' },
        { status: 400 }
      );
    }

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length < 5) {
      return NextResponse.json(
        { error: 'PROMPT_TOO_SHORT', message: 'Prompt must be at least 5 characters long.' },
        { status: 400 }
      );
    }

    if (trimmedPrompt.length > 4000) {
      return NextResponse.json(
        { error: 'PROMPT_TOO_LONG', message: 'Prompt cannot exceed 4,000 characters.' },
        { status: 400 }
      );
    }

    const normalizedBookType = String(bookType).toLowerCase().trim();
    if (!ALLOWED_BOOK_TYPES.includes(normalizedBookType)) {
      return NextResponse.json(
        {
          error: 'INVALID_BOOK_TYPE',
          message: `Unsupported bookType "${bookType}". Allowed types: ${ALLOWED_BOOK_TYPES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const normalizedLanguage = String(language).toLowerCase().trim();
    if (!ALLOWED_LANGUAGES.includes(normalizedLanguage)) {
      return NextResponse.json(
        {
          error: 'INVALID_LANGUAGE',
          message: `Unsupported language "${language}". Allowed languages: ${ALLOWED_LANGUAGES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const normalizedStyle = String(style).toLowerCase().trim();
    if (!ALLOWED_STYLES.includes(normalizedStyle)) {
      return NextResponse.json(
        {
          error: 'INVALID_STYLE',
          message: `Unsupported style "${style}". Allowed styles: ${ALLOWED_STYLES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const targetPages = Math.min(Math.max(Number(pageTarget) || 16, 4), 150);

    // 3. Server Authentication Boundary (Strictly require verified Supabase user)
    let authenticatedUserId: string | null = null;
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (user && !authError) {
        authenticatedUserId = user.id;
      }
    } catch (authErr) {
      console.warn('Auth verification warning:', authErr);
    }

    if (!authenticatedUserId) {
      return NextResponse.json(
        {
          error: 'UNAUTHORIZED',
          message: 'Authentication required. Please sign in or create a free account to generate books.',
        },
        { status: 401 }
      );
    }

    // 4. Enforce Server-Side Plan Quota & Entitlements
    const quotaCheck = await AICostController.validatePlanQuota(authenticatedUserId, targetPages);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: 'QUOTA_EXCEEDED',
          message: quotaCheck.reason,
          tier: quotaCheck.tier,
          limits: quotaCheck.limits,
        },
        { status: 403 }
      );
    }

    // 5. Initialize Book and Queue Generation
    const { bookId, jobId } = await GenerationPipeline.createBookAndJob({
      userId: authenticatedUserId,
      prompt: trimmedPrompt,
      bookType: (normalizedBookType as BookType | 'auto'),
      language: normalizedLanguage,
      style: normalizedStyle,
      uploadedContext: typeof uploadedContext === 'string' ? uploadedContext.slice(0, 10000) : undefined,
    });

    return NextResponse.json({
      bookId,
      jobId,
      status: 'planning',
      message: 'Generation job successfully queued.',
    });
  } catch (err: any) {
    console.error('Create book API error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err.message || 'Failed to initiate book generation.' },
      { status: 500 }
    );
  }
}
