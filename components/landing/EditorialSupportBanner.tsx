'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquareText } from 'lucide-react';

export function EditorialSupportBanner() {
  return (
    <section className="py-8 bg-[#FAFAFA] dark:bg-[#121212] border-b border-[#F0F0EE] dark:border-[#1E1E1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-[#EAEAEA] dark:border-[#222222] bg-white dark:bg-[#161616] shadow-2xs">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F3F3F1] dark:bg-[#202020] flex items-center justify-center text-[#111111] dark:text-white shrink-0">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#111111] dark:text-white">
                Need help finishing or formatting your book?
              </h3>
              <p className="text-xs text-[#666666] dark:text-[#999999] mt-0.5">
                Our editorial support team provides manuscript guidance, custom pre-press validation, and distribution advice.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-[#EAEAEA] transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <span>Editorial Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>
      </div>
    </section>
  );
}
