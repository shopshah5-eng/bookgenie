'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, DollarSign, Users, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AffiliatePage() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [applied, setApplied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  const benefits = [
    {
      title: '30% Recurring Commission',
      desc: 'Earn 30% of every subscription payment for the entire lifetime of your referred creators.',
      icon: <DollarSign className="w-6 h-6 text-[#9A6F3C]" />,
    },
    {
      title: '60-Day Referral Cookie',
      desc: 'Your referrals are tracked for 60 full days after clicking your unique invitation link.',
      icon: <Users className="w-6 h-6 text-[#9A6F3C]" />,
    },
    {
      title: 'Promotional Resources & Assets',
      desc: 'Get access to high-converting banners, demo books, copy templates, and product video clips.',
      icon: <Award className="w-6 h-6 text-[#9A6F3C]" />,
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F3EA] text-[#8C5F2E] border border-[#E8DCCB] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Affiliate Program
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1612] tracking-tight mb-4">
              Earn with BookGenie
            </h1>
            <p className="text-sm sm:text-base text-[#6B635B]">
              Partner with the leading luxury AI publishing platform. Share BookGenie with your audience and build recurring monthly revenue.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-8 rounded-3xl bg-white border border-[#EFECE6] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F3EA] flex items-center justify-center border border-[#E8DCCB] mb-5">
                    {b.icon}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#1A1612] mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Application Form Card */}
          <div className="max-w-xl mx-auto rounded-3xl bg-white border border-[#EFECE6] p-8 sm:p-10 shadow-lg text-center">
            {applied ? (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1A1612]">
                  Application Received!
                </h3>
                <p className="text-xs sm:text-sm text-[#6B635B] max-w-md mx-auto">
                  Thank you for applying to the BookGenie Partner Program. Our team will review your application and email your custom referral link within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif font-bold text-[#1A1612] mb-2">
                  Apply to Become an Affiliate Partner
                </h2>
                <p className="text-xs sm:text-sm text-[#6B635B] mb-6">
                  Fill out the form below to receive your unique referral link and promotional toolkit.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1612] mb-1.5">
                      Your Email Address
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1612] mb-1.5">
                      Website or Primary Social Channel
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="https://youtube.com/@yourchannel or blog URL"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full mt-2 font-semibold">
                    Submit Affiliate Application <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
