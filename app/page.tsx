'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { PromptBarSection } from '@/components/landing/PromptBarSection';
import { PromptToPageShowcase } from '@/components/landing/PromptToPageShowcase';
import { BookShowcase } from '@/components/landing/BookShowcase';
import { TechnicalQualitySection } from '@/components/landing/TechnicalQualitySection';
import { StudioWorkflowSection } from '@/components/landing/StudioWorkflowSection';
import { ExportFormatsSection } from '@/components/landing/ExportFormatsSection';
import { CategoriesBentoSection } from '@/components/landing/CategoriesBentoSection';
import { AudienceSection } from '@/components/landing/AudienceSection';
import { Testimonials } from '@/components/landing/Testimonials';
import { PricingTeaserSection } from '@/components/landing/PricingTeaserSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { EditorialSupportBanner } from '@/components/landing/EditorialSupportBanner';
import { CallToActionBanner } from '@/components/landing/CallToActionBanner';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#000000] text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
        {/* 01 Sticky Editorial Glass Header with Theme Switcher */}
        <Header />

        {/* Main Landing Page Flow */}
        <main className="flex-1">
          {/* 02 Editorial Hero: AI Publishing Studio + Standing Book Mockup */}
          <HeroSection />

          {/* 03 What do you want to create today? Real Controls: Upload, Category, Lang, Style */}
          <PromptBarSection />

          {/* 04 From blank page to bound book: 7-Stage Publishing Architecture (Restored VERIFY) */}
          <div id="workflow">
            <PromptToPageShowcase />
          </div>

          {/* 05 Explore the BookGenie Library: Real Showcase with Preview & Create Similar */}
          <div id="examples">
            <BookShowcase />
          </div>

          {/* 06 More than AI writing: Structured, Consistent, Editorial, Verified, Publication-Ready */}
          <TechnicalQualitySection />

          {/* 07 Meet your publishing studio: 6-Stage Studio Workspace & Typeset Canvas */}
          <StudioWorkflowSection />

          {/* 08 One book. Every format: 300 DPI CMYK PDF, Reflowable EPUB3, Private Web Reader */}
          <ExportFormatsSection />

          {/* 09 One studio. Every kind of book: 6 Genre & Format Bento Cards */}
          <CategoriesBentoSection />

          {/* 10 Built for every kind of creator: Authors, Educators, Solopreneurs */}
          <AudienceSection />

          {/* 11 Your work stays yours: Supabase Row-Level Security & 100% Commercial Rights */}
          <Testimonials />

          {/* 12 Transparent Pricing Teaser: Free Creator Studio vs Pro Edition */}
          <PricingTeaserSection />

          {/* 13 Frequently Asked Questions */}
          <FAQSection />

          {/* 14 Editorial Support Banner */}
          <EditorialSupportBanner />

          {/* 15 Final Call to Action Banner + Book Spine Still Life */}
          <CallToActionBanner />
        </main>

        {/* 16 Comprehensive 4-Column Footer */}
        <Footer />

        {/* Centered Backdrop-Blur Authentication Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}

