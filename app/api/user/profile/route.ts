// app/api/user/profile/route.ts
// Secure user profile update endpoint

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const newName = typeof body.name === 'string' ? body.name.trim() : '';

    if (!newName || newName.length < 2) {
      return NextResponse.json(
        { error: 'INVALID_NAME', message: 'Name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    if (newName.length > 60) {
      return NextResponse.json(
        { error: 'NAME_TOO_LONG', message: 'Name cannot exceed 60 characters.' },
        { status: 400 }
      );
    }

    // 1. Update user auth metadata
    const { data: updatedAuth, error: updateAuthErr } = await supabase.auth.updateUser({
      data: {
        full_name: newName,
        name: newName,
      },
    });

    if (updateAuthErr) {
      console.warn('Supabase auth updateUser warning:', updateAuthErr);
    }

    // 2. Update public.profiles table using admin client to ensure permissions
    try {
      const adminSupabase = createAdminClient();
      await adminSupabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            full_name: newName,
            email: user.email || '',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
    } catch (profileErr) {
      console.warn('Profiles table update notice:', profileErr);
    }

    return NextResponse.json({
      success: true,
      name: newName,
      user: updatedAuth?.user || user,
    });
  } catch (err: unknown) {
    console.error('Update profile error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err instanceof Error ? err.message : 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
