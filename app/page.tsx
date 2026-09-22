'use client';

import React from 'react';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhatCanYouCreate } from '@/components/landing/WhatCanYouCreate';
import { MyEbookShelf } from '@/components/landing/MyEbookShelf';
import { ValueProps } from '@/components/landing/ValueProps';
import { BookShowcase } from '@/components/landing/BookShowcase';
import { Testimonials } from '@/components/landing/Testimonials';
import { CallToActionBanner } from '@/components/landing/CallToActionBanner';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        {/* Navigation Header */}
        <Header />

        {/* Main Landing Flow */}
        <main className="flex-1">
          <HeroSection />
          <div id="what-can-you-create">
            <WhatCanYouCreate />
          </div>
          <MyEbookShelf />
          <ValueProps />
          <BookShowcase />
          <Testimonials />
          <CallToActionBanner />
        </main>

        {/* Multi-Column Footer */}
        <Footer />

        {/* Centered Backdrop-Blur Authentication Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
