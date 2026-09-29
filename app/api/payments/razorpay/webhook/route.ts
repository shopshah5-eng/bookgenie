// app/api/payments/razorpay/webhook/route.ts
// Secure Razorpay Webhook listener with HMAC-SHA256 signature verification and event idempotency.

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyWebhookSignature } from '@/lib/payments/razorpay';
import { getPlan } from '@/lib/payments/plans';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'MISSING_SIGNATURE', message: 'x-razorpay-signature header is missing.' },
        { status: 400 }
      );
    }

    // 1. Cryptographic HMAC verification
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('Razorpay webhook: invalid signature rejected.');
      return NextResponse.json(
        { error: 'INVALID_SIGNATURE', message: 'Cryptographic signature mismatch.' },
        { status: 400 }
      );
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'INVALID_JSON', message: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    const eventId = String(payload.event_id || (payload as { id?: string }).id || `${Date.now()}_${Math.random()}`);
    const eventType = String(payload.event || '');

    const admin = createAdminClient();

    // 2. Strict Idempotency check via razorpay_events table
    const { data: existingEvent } = await admin
      .from('razorpay_events')
      .select('event_id')
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({
        received: true,
        idempotent: true,
        message: 'Event was already processed previously.',
      });
    }

    // Record event to prevent double-processing
    await admin.from('razorpay_events').insert({
      event_id: eventId,
      event_type: eventType,
      payload: (payload as unknown) as Record<string, unknown>,
    });

    // 3. Process events
    const eventData = (payload.payload || {}) as Record<string, unknown>;

    switch (eventType) {
      case 'payment.captured':
      case 'order.paid': {
        const paymentEntity = ((eventData.payment as { entity?: Record<string, unknown> })?.entity || {}) as Record<string, unknown>;
        const orderId = String(paymentEntity.order_id || '');
        const paymentId = String(paymentEntity.id || '');
        const notes = (paymentEntity.notes || {}) as Record<string, unknown>;
        const planId = String(notes.planId || '');
        const userId = String(notes.userId || '');

        if (orderId) {
          // Update purchase record
          await admin
            .from('purchases')
            .update({
              status: 'captured',
              razorpay_payment_id: paymentId,
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', orderId);
        }

        // Grant entitlement if plan and user identified
        const plan = getPlan(planId);
        if (plan && userId) {
          // Check if entitlement was already created by the synchronous verify endpoint
          const { data: existingEnt } = await admin
            .from('entitlements')
            .select('id')
            .eq('user_id', userId)
            .eq('plan_id', plan.id)
            .gte('created_at', new Date(Date.now() - 3600000).toISOString())
            .maybeSingle();

          if (!existingEnt) {
            await admin.from('entitlements').insert({
              user_id: userId,
              plan_id: plan.id,
              max_pages: plan.maxPagesPerBook,
              allowed_formats: plan.allowedFormats,
              has_watermark: plan.hasWatermark,
              commercial_rights: plan.commercialUse,
              can_regenerate: plan.canRegenerate,
              books_remaining: plan.maxBooksAllowed,
            });

            await admin
              .from('profiles')
              .update({ tier: plan.id, updated_at: new Date().toISOString() })
              .eq('id', userId);
          }
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = ((eventData.payment as { entity?: Record<string, unknown> })?.entity || {}) as Record<string, unknown>;
        const orderId = String(paymentEntity.order_id || '');
        if (orderId) {
          await admin
            .from('purchases')
            .update({
              status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', orderId);
        }
        break;
      }

      case 'subscription.activated':
      case 'subscription.charged': {
        const subEntity = ((eventData.subscription as { entity?: Record<string, unknown> })?.entity || {}) as Record<string, unknown>;
        const subId = String(subEntity.id || '');
        const customerId = String(subEntity.customer_id || '');
        const notes = (subEntity.notes || {}) as Record<string, unknown>;
        const userId = String(notes.userId || '');

        if (subId && userId) {
          await admin.from('subscriptions').upsert(
            {
              user_id: userId,
              plan_id: 'creator',
              razorpay_subscription_id: subId,
              razorpay_customer_id: customerId,
              status: 'active',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'razorpay_subscription_id' }
          );

          await admin
            .from('profiles')
            .update({ tier: 'creator', updated_at: new Date().toISOString() })
            .eq('id', userId);
        }
        break;
      }

      case 'subscription.paused':
      case 'subscription.cancelled': {
        const subEntity = ((eventData.subscription as { entity?: Record<string, unknown> })?.entity || {}) as Record<string, unknown>;
        const subId = String(subEntity.id || '');
        if (subId) {
          const newStatus = eventType === 'subscription.paused' ? 'paused' : 'cancelled';
          await admin
            .from('subscriptions')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('razorpay_subscription_id', subId);
        }
        break;
      }

      case 'refund.processed': {
        const refundEntity = ((eventData.refund as { entity?: Record<string, unknown> })?.entity || {}) as Record<string, unknown>;
        const paymentId = String(refundEntity.payment_id || '');
        if (paymentId) {
          await admin
            .from('purchases')
            .update({ status: 'refunded', updated_at: new Date().toISOString() })
            .eq('razorpay_payment_id', paymentId);
        }
        break;
      }

      default:
        // Other non-critical events acknowledged
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Razorpay webhook execution error:', err);
    return NextResponse.json(
      { error: 'WEBHOOK_PROCESSING_FAILED' },
      { status: 500 }
    );
  }
}
