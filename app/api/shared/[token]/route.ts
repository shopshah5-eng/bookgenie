import { NextRequest, NextResponse } from 'next/server';
import { getServerSharedBook } from '@/lib/book/server-books';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    const book = await getServerSharedBook(token);

    if (!book) {
      return NextResponse.json(
        { error: 'Shared publication not found or private.' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (err) {
    console.error('Shared publication error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve shared publication.' },
      { status: 500 }
    );
  }
}
