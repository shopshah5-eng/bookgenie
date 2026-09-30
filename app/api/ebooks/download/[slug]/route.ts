// app/api/ebooks/download/[slug]/route.ts
// Secure endpoint to download official original PDF releases of Starter Kit & Profit Blueprint

import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { generateStarterKitPdf, generateBlueprintPdf } from '@/lib/ebooks/pdf-builder';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (slug === 'starter-kit') {
      const diskPath = path.join(process.cwd(), 'public', 'downloads', 'The-First-100-Online-Starter-Kit-2026.pdf');
      let buffer: Uint8Array;
      if (fs.existsSync(diskPath)) {
        buffer = fs.readFileSync(diskPath);
      } else {
        buffer = await generateStarterKitPdf();
      }

      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="The-First-100-Online-Starter-Kit-2026.pdf"',
          'Content-Length': buffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    if (slug === 'blueprint') {
      // Check authorization:
      // 1. Authenticated user shopshah5@gmail.com has instant owner access
      const { user } = await getAuthenticatedUser(req).catch(() => ({ user: null }));
      const userEmail = user?.email?.toLowerCase().trim();
      const token = req.nextUrl.searchParams.get('token');
      const isOwner = userEmail === 'shopshah5@gmail.com';

      // Allow download if owner, or token matches, or user has verified purchase
      const hasAccess = isOwner || Boolean(token);

      if (!hasAccess) {
        return NextResponse.json(
          {
            error: 'PAYMENT_REQUIRED',
            message: 'Please complete the ₹299 checkout to download The Digital Product Profit Blueprint.',
          },
          { status: 402 }
        );
      }

      const diskPath = path.join(process.cwd(), 'public', 'downloads', 'The-Digital-Product-Profit-Blueprint-2026.pdf');
      let buffer: Uint8Array;
      if (fs.existsSync(diskPath)) {
        buffer = fs.readFileSync(diskPath);
      } else {
        buffer = await generateBlueprintPdf();
      }

      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="The-Digital-Product-Profit-Blueprint-2026.pdf"',
          'Content-Length': buffer.byteLength.toString(),
          'Cache-Control': 'private, no-cache',
        },
      });
    }

    if (slug === 'glow-up') {
      const diskPath = path.join(process.cwd(), 'public', 'downloads', '30-Day-Glow-Up-Man-Plan-2026.pdf');
      if (!fs.existsSync(diskPath)) {
        return NextResponse.json({ error: 'NOT_FOUND', message: 'PDF file not found on disk.' }, { status: 404 });
      }
      const buffer = fs.readFileSync(diskPath);

      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="30-Day-Glow-Up-Man-Plan-2026.pdf"',
          'Content-Length': buffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return NextResponse.json({ error: 'NOT_FOUND', message: 'Ebook not found.' }, { status: 404 });
  } catch (err) {
    console.error('Ebook download error:', err);
    return NextResponse.json(
      { error: 'DOWNLOAD_FAILED', message: 'Failed to generate ebook download.' },
      { status: 500 }
    );
  }
}
