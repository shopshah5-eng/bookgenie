// app/api/affiliate/payout-settings/route.ts
// Secure endpoint for affiliate partners to configure their UPI ID or Bank Details for monthly payouts.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in to update payout settings.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const method = typeof body?.method === 'string' ? body.method.toLowerCase().trim() : 'upi';

    let validatedSettings: Record<string, string> = { method };

    if (method === 'upi') {
      const upiId = typeof body?.upiId === 'string' ? body.upiId.trim() : '';
      const accountHolderName = typeof body?.accountHolderName === 'string' ? body.accountHolderName.trim() : '';

      if (!upiId || !upiId.includes('@') || upiId.length < 5 || upiId.length > 50) {
        return NextResponse.json(
          { error: 'INVALID_UPI', message: 'Please enter a valid UPI ID (e.g. yourname@okhdfcbank or partner@upi).' },
          { status: 400 }
        );
      }

      if (!accountHolderName || accountHolderName.length < 2) {
        return NextResponse.json(
          { error: 'INVALID_NAME', message: 'Please enter the Account Holder Name matching your UPI account.' },
          { status: 400 }
        );
      }

      validatedSettings = {
        method: 'upi',
        upiId,
        accountHolderName,
      };
    } else if (method === 'bank') {
      const accountHolderName = typeof body?.accountHolderName === 'string' ? body.accountHolderName.trim() : '';
      const bankName = typeof body?.bankName === 'string' ? body.bankName.trim() : '';
      const accountNumber = typeof body?.accountNumber === 'string' ? body.accountNumber.trim() : '';
      const ifscCode = typeof body?.ifscCode === 'string' ? body.ifscCode.trim().toUpperCase() : '';

      if (!accountHolderName || accountHolderName.length < 2) {
        return NextResponse.json(
          { error: 'INVALID_NAME', message: 'Account holder name is required.' },
          { status: 400 }
        );
      }
      if (!bankName || bankName.length < 2) {
        return NextResponse.json(
          { error: 'INVALID_BANK', message: 'Bank name is required.' },
          { status: 400 }
        );
      }
      if (!accountNumber || accountNumber.length < 8 || accountNumber.length > 30) {
        return NextResponse.json(
          { error: 'INVALID_ACCOUNT', message: 'Please enter a valid bank account number (8–30 digits).' },
          { status: 400 }
        );
      }
      if (!ifscCode || ifscCode.length < 4 || ifscCode.length > 15) {
        return NextResponse.json(
          { error: 'INVALID_IFSC', message: 'Please enter a valid IFSC or SWIFT routing code.' },
          { status: 400 }
        );
      }

      validatedSettings = {
        method: 'bank',
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
      };
    } else if (method === 'paypal') {
      const paypalEmail = typeof body?.paypalEmail === 'string' ? body.paypalEmail.trim().toLowerCase() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!paypalEmail || !emailRegex.test(paypalEmail)) {
        return NextResponse.json(
          { error: 'INVALID_PAYPAL', message: 'Please provide a valid PayPal email address.' },
          { status: 400 }
        );
      }

      validatedSettings = {
        method: 'paypal',
        paypalEmail,
      };
    } else {
      return NextResponse.json(
        { error: 'INVALID_METHOD', message: 'Invalid payout method selected.' },
        { status: 400 }
      );
    }

    // Persist to user metadata using privileged Admin Client
    const admin = createAdminClient();
    const existingMetadata = (user.user_metadata as Record<string, unknown>) || {};

    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...existingMetadata,
        affiliate_payout_settings: {
          ...validatedSettings,
          updated_at: new Date().toISOString(),
        },
      },
    });

    if (updateError) {
      console.error('Failed to update payout settings:', updateError);
      return NextResponse.json(
        { error: 'DB_ERROR', message: 'Failed to save payout settings. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payout details saved successfully! Earnings over $10 will be transferred directly to this account.',
      payoutSettings: validatedSettings,
    });
  } catch (err) {
    console.error('Save payout settings error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred while saving payout details.' },
      { status: 500 }
    );
  }
}
