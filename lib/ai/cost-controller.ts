// lib/ai/cost-controller.ts
// Intelligent multi-tier router & cost controller for BookGenie
// Determines the cheapest acceptable model for each task and manages prompt caching

import type { BookType } from '../book/types';
import { createAdminClient } from '../supabase/admin';
import { CANONICAL_PLANS, type PlanId, type PlanDefinition } from '../payments/plans';

export interface PlanEntitlement {
  tier: PlanId;
  name: string;
  maxBooksPerMonth: number;
  maxPagesPerBook: number;
  hasWatermark: boolean;
  commercialUse: boolean;
  priorityQueue: boolean;
}

export const PLAN_LIMITS: Record<PlanId, PlanEntitlement> = {
  free: {
    tier: 'free',
    name: 'FREE (₹0)',
    maxBooksPerMonth: 1,
    maxPagesPerBook: 20,
    hasWatermark: true,
    commercialUse: false,
    priorityQueue: false,
  },
  single: {
    tier: 'single',
    name: 'ONE-TIME BOOK (₹299+)',
    maxBooksPerMonth: 1,
    maxPagesPerBook: 200,
    hasWatermark: false,
    commercialUse: true,
    priorityQueue: false,
  },
  pro: {
    tier: 'pro',
    name: 'PRO (₹999/mo)',
    maxBooksPerMonth: 20,
    maxPagesPerBook: 100,
    hasWatermark: false,
    commercialUse: true,
    priorityQueue: true,
  },
  creator: {
    tier: 'creator',
    name: 'CREATOR (₹1999/mo)',
    maxBooksPerMonth: 50,
    maxPagesPerBook: 200,
    hasWatermark: false,
    commercialUse: true,
    priorityQueue: true,
  },
};

export type TextTaskType =
  | 'classification'
  | 'planning'
  | 'chapter_writing'
  | 'qc_check'
  | 'micro_revision'
  | 'complex_revision';

export interface ModelSelection {
  tier: 'free_or_cheap' | 'standard' | 'premium';
  modelId: string;
  maxTokens: number;
  temperature: number;
}

export class AICostController {
  /**
   * Selects the most cost-effective text model based on task complexity and book type
   */
  static selectTextModel(task: TextTaskType, bookType?: BookType): ModelSelection {
    const fastModel = 'meta-llama/llama-3.1-8b-instruct';
    const rawDev = process.env.AI_TEXT_MODEL_DEV || fastModel;
    const devModel = rawDev.includes('free') ? fastModel : rawDev;
    // Serverless functions have strict 26s execution limits.
    // If standardModel is configured to a heavy 70b+ model, use fastModel for synchronous serverless generation.
    const rawStandard = process.env.AI_TEXT_MODEL_STANDARD || fastModel;
    const standardModel = rawStandard.includes('70b') ? fastModel : rawStandard;
    const premiumModel = process.env.AI_TEXT_MODEL_PREMIUM || 'anthropic/claude-3.5-sonnet';

    // Tier 1: Fast & deterministic for metadata, classification, QC & micro-revisions
    if (task === 'classification' || task === 'qc_check' || task === 'micro_revision') {
      return {
        tier: 'free_or_cheap',
        modelId: fastModel,
        maxTokens: task === 'micro_revision' ? 1500 : 1200,
        temperature: 0.2, // low temp for deterministic JSON extraction
      };
    }

    if (task === 'complex_revision') {
      return {
        tier: 'standard',
        modelId: fastModel,
        maxTokens: 2000,
        temperature: 0.4,
      };
    }

    // Tier 3: Premium for complex novels, rich children's books, or heavy revisions
    if (
      (bookType === 'novel' || bookType === 'children') &&
      task === 'chapter_writing'
    ) {
      return {
        tier: 'premium',
        modelId: premiumModel,
        maxTokens: 4000,
        temperature: 0.7,
      };
    }

    // Tier 2: Standard for planning, guides, recipes, workbooks, history
    return {
      tier: 'standard',
      modelId: standardModel,
      maxTokens: task === 'planning' ? 2000 : 3000,
      temperature: 0.6,
    };
  }

  /**
   * Builds prompt-cached payload structure for OpenRouter
   * OpenRouter caches repeated prefixes, significantly slashing prompt token costs
   */
  static buildCachedPrompt(
    systemPrompt: string,
    bookContext: {
      title: string;
      bookType: string;
      audience: string;
      language: string;
      style: string;
      characterBible?: Record<string, string>;
    },
    dynamicContentPrompt: string
  ) {
    const cachedPrefix = `
[SYSTEM INSTRUCTION & CACHED RULES]
${systemPrompt}

[BOOK SPECIFICATION]
Title: ${bookContext.title}
Genre: ${bookContext.bookType}
Audience: ${bookContext.audience}
Language: ${bookContext.language}
Style: ${bookContext.style}
${
  bookContext.characterBible
    ? `\n[CHARACTER BIBLE]\n${JSON.stringify(bookContext.characterBible, null, 2)}`
    : ''
}
`.trim();

    return {
      messages: [
        {
          role: 'system',
          content: cachedPrefix,
        },
        {
          role: 'user',
          content: dynamicContentPrompt,
        },
      ],
    };
  }

  /**
   * Estimates cost before generation to protect operational margins
   */
  static estimateGenerationCost(params: {
    pageTarget: number;
    estimatedImages: number;
    bookType: BookType;
  }): { estimatedCostUsd: number; imageBudget: number } {
    // Smart visual planner allocation: ~1 image per 3-5 pages or cover + key scenes
    let imageBudget = 1; // cover
    if (params.bookType === 'children') {
      imageBudget = Math.min(Math.max(Math.round(params.pageTarget / 2), 6), 16);
    } else if (params.bookType === 'coloring') {
      imageBudget = Math.min(params.pageTarget - 2, 25);
    } else {
      imageBudget = Math.min(Math.max(Math.round(params.pageTarget / 5), 2), 10);
    }

    // Estimate: $0.002 per 1k text tokens, ~$0.04 per Gemini/Fal image
    const estimatedTokens = params.pageTarget * 350;
    const textCost = (estimatedTokens / 1000) * 0.002;
    const imageCost = imageBudget * 0.04;

    return {
      estimatedCostUsd: Number((textCost + imageCost).toFixed(4)),
      imageBudget,
    };
  }

  /**
   * Enforces backend plan entitlements and validates user quota before generation.
   * Checks for valid unused entitlements, active creator subscriptions, or the free tier quota.
   */
  static async validatePlanQuota(
    userId: string,
    requestedPages = 10
  ): Promise<{
    allowed: boolean;
    reason?: string;
    tier: PlanId;
    limits: PlanEntitlement;
    entitlementId?: string;
    hasWatermark: boolean;
    commercialUse: boolean;
    canRegenerate: boolean;
  }> {
    try {
      const supabase = createAdminClient();

      // 1. Check for unused paid entitlement (Book / Book Plus / Creator one-time or grant credits)
      const { data: entitlements, error: entError } = await supabase
        .from('entitlements')
        .select('*')
        .eq('user_id', userId)
        .gt('books_remaining', 0)
        .order('max_pages', { ascending: false });

      if (!entError && entitlements && entitlements.length > 0) {
        // Find best matching entitlement that covers requested pages, or largest available
        const activeEnt = entitlements.find((e) => requestedPages <= e.max_pages) || entitlements[0];
        const planKey = (activeEnt.plan_id as PlanId) || 'pro';
        const plan = PLAN_LIMITS[planKey] || PLAN_LIMITS.pro;

        if (requestedPages > activeEnt.max_pages) {
          return {
            allowed: false,
            reason: `Your ${plan.name} entitlement supports up to ${activeEnt.max_pages} pages per book. Please reduce page target to ${activeEnt.max_pages} or upgrade.`,
            tier: planKey,
            limits: plan,
            hasWatermark: activeEnt.has_watermark ?? false,
            commercialUse: activeEnt.commercial_rights ?? true,
            canRegenerate: activeEnt.can_regenerate ?? false,
          };
        }

        return {
          allowed: true,
          tier: planKey,
          limits: plan,
          entitlementId: activeEnt.id,
          hasWatermark: activeEnt.has_watermark ?? false,
          commercialUse: activeEnt.commercial_rights ?? true,
          canRegenerate: activeEnt.can_regenerate ?? false,
        };
      }

      // 2. Check for active subscription (Creator monthly plan)
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (sub) {
        const subPlanKey = (sub.plan_id as PlanId) === 'creator' ? 'creator' : 'pro';
        const subPlan = PLAN_LIMITS[subPlanKey];
        if (requestedPages > subPlan.maxPagesPerBook) {
          return {
            allowed: false,
            reason: `The ${subPlan.name} supports up to ${subPlan.maxPagesPerBook} pages per book.`,
            tier: subPlanKey,
            limits: subPlan,
            hasWatermark: false,
            commercialUse: true,
            canRegenerate: true,
          };
        }

        // Count books created in current calendar month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const { count, error: countErr } = await supabase
          .from('books')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', startOfMonth);

        if (!countErr && typeof count === 'number' && count >= subPlan.maxBooksPerMonth) {
          return {
            allowed: false,
            reason: `You have reached your monthly limit of ${subPlan.maxBooksPerMonth} books on the ${subPlan.name}.`,
            tier: subPlanKey,
            limits: subPlan,
            hasWatermark: false,
            commercialUse: true,
            canRegenerate: true,
          };
        }

        return {
          allowed: true,
          tier: subPlanKey,
          limits: subPlan,
          hasWatermark: false,
          commercialUse: true,
          canRegenerate: true,
        };
      }

      // 3. Fallback to FREE plan
      const freePlan = PLAN_LIMITS.free;
      if (requestedPages > freePlan.maxPagesPerBook) {
        return {
          allowed: false,
          reason: `The FREE plan supports up to ${freePlan.maxPagesPerBook} pages. Please select up to ${freePlan.maxPagesPerBook} pages or choose a plan (One-Time Book, Pro, or Creator).`,
          tier: 'free',
          limits: freePlan,
          hasWatermark: true,
          commercialUse: false,
          canRegenerate: false,
        };
      }

      // Count total lifetime books created by this user
      const { count: totalBooks, error: booksErr } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (!booksErr && typeof totalBooks === 'number' && totalBooks >= freePlan.maxBooksPerMonth) {
        return {
          allowed: false,
          reason: `You have already used your ${freePlan.maxBooksPerMonth} free ebook on the Free plan. Choose a plan from the homepage to generate your next book.`,
          tier: 'free',
          limits: freePlan,
          hasWatermark: true,
          commercialUse: false,
          canRegenerate: false,
        };
      }

      return {
        allowed: true,
        tier: 'free',
        limits: freePlan,
        hasWatermark: true,
        commercialUse: false,
        canRegenerate: false,
      };
    } catch (err) {
      console.error('Quota check failed:', err);
      return {
        allowed: false,
        reason: 'Usage limits are temporarily unavailable. Please try again shortly.',
        tier: 'free',
        limits: PLAN_LIMITS.free,
        hasWatermark: true,
        commercialUse: false,
        canRegenerate: false,
      };
    }
  }
}
