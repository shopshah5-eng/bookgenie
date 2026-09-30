import { NextResponse } from 'next/server';
import { isRazorpayConfigured } from '@/lib/payments/razorpay';
import { getSupabaseConfig } from '@/lib/supabase/config';

export async function GET() {
  const openRouterConfigured = Boolean(process.env.OPENROUTER_API_KEY?.trim());
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());
  const nvidiaConfigured = Boolean(process.env.NVIDIA_API_KEY?.trim());
  const supabaseConfigured = getSupabaseConfig() !== null;
  const razorpayConfigured = isRazorpayConfigured();

  const textProvider = process.env.AI_TEXT_PROVIDER || (nvidiaConfigured ? 'nvidia' : 'openrouter');
  const isImageGemini = process.env.AI_IMAGE_PROVIDER === 'gemini' && geminiConfigured;

  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    providers: {
      text: {
        provider: textProvider,
        configured: textProvider === 'nvidia' ? nvidiaConfigured : openRouterConfigured,
        status: (textProvider === 'nvidia' ? nvidiaConfigured : openRouterConfigured) ? 'ready' : 'missing_api_key',
      },
      image: {
        freeTier: 'pollinations',
        paidTier: isImageGemini ? 'gemini' : 'pollinations',
        configured: geminiConfigured,
        watermark: isImageGemini ? 'none_on_paid' : 'pollinations_watermark_on_free',
        status: 'ready',
      },
      database: {
        provider: 'supabase',
        configured: supabaseConfigured,
        status: supabaseConfigured ? 'connected' : 'missing_credentials',
      },
      payments: {
        provider: 'razorpay',
        configured: razorpayConfigured,
        status: razorpayConfigured ? 'active' : 'unconfigured',
      },
    },
    system: {
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.1',
    },
  };

  return NextResponse.json(status);
}
