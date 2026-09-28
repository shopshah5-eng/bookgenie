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

    let normalizedBookType = String(bookType || 'auto').toLowerCase().trim();
    if (normalizedBookType === 'cookbook') normalizedBookType = 'recipe';
    if (normalizedBookType === 'other' || !ALLOWED_BOOK_TYPES.includes(normalizedBookType)) {
      normalizedBookType = 'auto';
    }

    const rawLang = String(language || 'english').toLowerCase().trim();
    let normalizedLanguage = 'english';
    if (rawLang.includes('spanish')) normalizedLanguage = 'spanish';
    else if (rawLang.includes('french')) normalizedLanguage = 'french';
    else if (rawLang.includes('german')) normalizedLanguage = 'german';
    else if (rawLang.includes('hindi')) normalizedLanguage = 'hindi';
    else if (rawLang.includes('japanese')) normalizedLanguage = 'japanese';
    else if (rawLang.includes('italian')) normalizedLanguage = 'italian';
    else if (rawLang.includes('portuguese')) normalizedLanguage = 'portuguese';
    else if (rawLang.includes('mandarin') || rawLang.includes('chinese')) normalizedLanguage = 'mandarin';
    else if (ALLOWED_LANGUAGES.includes(rawLang)) normalizedLanguage = rawLang;

    const rawStyle = String(style || 'modern').toLowerCase().trim();
    let normalizedStyle = 'modern';
    if (rawStyle.includes('editorial') || rawStyle.includes('mccarthy')) normalizedStyle = 'editorial';
    else if (rawStyle.includes('academic')) normalizedStyle = 'academic';
    else if (rawStyle.includes('playful') || rawStyle.includes('lyrical') || rawStyle.includes('watercolor')) normalizedStyle = 'playful';
    else if (rawStyle.includes('minimal') || rawStyle.includes('executive')) normalizedStyle = 'minimal';
    else if (rawStyle.includes('vintage')) normalizedStyle = 'vintage';
    else if (rawStyle.includes('whimsical')) normalizedStyle = 'whimsical';
    else if (ALLOWED_STYLES.includes(rawStyle)) normalizedStyle = rawStyle;

    const calculatedPages = Number(pageTarget) || (body.chapterScale === 1 ? 16 : body.chapterScale === 2 ? 36 : body.chapterScale === 3 ? 72 : 16);
    const targetPages = Math.min(Math.max(calculatedPages, 4), 150);

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
      uploadedContext: typeof uploadedContext === 'string' ? uploadedContext.slice(0, 25000) : undefined,
      pageTarget: targetPages,
      chapterScale: Number(body.chapterScale) || 2,
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
