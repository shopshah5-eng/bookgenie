import { NextResponse } from 'next/server';
import { isRazorpayConfigured } from '@/lib/payments/razorpay';
import { getSupabaseConfig } from '@/lib/supabase/config';

export async function GET() {
  const openRouterConfigured = Boolean(process.env.OPENROUTER_API_KEY?.trim());
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());
  const supabaseConfigured = getSupabaseConfig() !== null;
  const razorpayConfigured = isRazorpayConfigured();

  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    providers: {
      text: {
        provider: 'openrouter',
        model: 'meta-llama/llama-3.1-8b-instruct',
        configured: openRouterConfigured,
        status: openRouterConfigured ? 'ready' : 'missing_api_key',
      },
      image: {
        provider: geminiConfigured ? 'gemini' : 'flux-pollinations',
        configured: geminiConfigured,
        fallback: 'flux',
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
      version: '1.0.0',
    },
  };

  return NextResponse.json(status);
}
