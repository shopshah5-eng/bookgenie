'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export function LaunchTeaserStrip() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 6,
    hours: 21,
    minutes: 45,
    seconds: 30,
  });

  const [preorderData, setPreorderData] = useState<{
    totalClaimed: number;
    maxSpots: number;
    activeTier?: {
      tierName: string;
      discountPercent: number;
      remainingInTier: number;
    };
  }>({
    totalClaimed: 0,
    maxSpots: 100,
    activeTier: {
      tierName: 'Tier 1: Super Early Bird',
      discountPercent: 50,
      remainingInTier: 25,
    },
  });

  useEffect(() => {
    const launchTarget = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = Math.max(launchTarget - now, 0);

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/preorder/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.totalClaimed === 'number') {
          setPreorderData(data);
        }
      })
      .catch(() => {});
  }, []);

  const discount = preorderData.activeTier?.discountPercent ?? 50;
  const remaining = preorderData.activeTier?.remainingInTier ?? 11;

  return (
    <div className="w-full bg-gradient-to-r from-[#FAF8F5] via-[#FFFDF9] to-[#F5EFE6] border-b border-[#EFECE6]/80 relative overflow-hidden py-3 px-4 sm:px-6">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-16 bg-amber-200/20 blur-2xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Left: Launch Announcement & Count of 100 */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#9A6F3C] text-white text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3 h-3" />
            Launching Within A Week
          </span>

          <p className="text-xs sm:text-sm text-[#1A1612] font-medium">
            First 100 founding users get{' '}
            <strong className="text-[#9A6F3C] font-bold">{discount}% OFF for their first 3 months!</strong>
          </p>

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold font-mono">
            <Flame className="w-3 h-3 text-emerald-600" />
            {remaining} spots left in Tier 1 ({preorderData.totalClaimed}/100 claimed)
          </span>
        </div>

        {/* Right: Live Countdown & Direct Link */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1A1612] bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#EFECE6] shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#9A6F3C]" />
            <span>
              {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h :{' '}
              {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          <Link
            href="/launch"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold transition-all shadow-xs group"
          >
            <span>Claim Discount</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
