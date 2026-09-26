'use client';

import React, { useState } from 'react';

export function PromptToPageShowcase() {
  const [viewMode, setViewMode] = useState<'split' | 'master'>('split');

  return (
    <div className="w-full">
      {/* 01: The Three Disciplines of Autonomous Craft */}
      <section className="w-full py-20 bg-surface-container-low dark:bg-[#1a1b22]/60 border-y border-surface-container-highest dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary dark:text-[#fcba64] block mb-3">
              Architectural Precision
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary dark:text-[#f1effa] max-w-xl mx-auto tracking-tight">
              The Three Disciplines of Autonomous Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Discipline 01 */}
            <div className="bg-surface-container-lowest dark:bg-[#121217] p-8 rounded-xl border border-surface-container-highest dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-white/5 flex items-center justify-center mb-6 text-primary dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[22px]">format_shapes</span>
                </div>
                <span className="font-code-spec text-code-spec text-on-surface-variant/70 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Discipline 01
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary dark:text-[#f1effa] mb-3">
                  Deterministic Typography
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-neutral-300 leading-relaxed">
                  Knuth-Plass line breaking algorithms, micro-kerning optical pairs, zero typographic widows or orphans, and strictly calibrated 4px baseline grids engineered for unhurried reading.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-on-surface dark:text-[#f1effa] font-label-ui text-label-ui border-t border-surface-container-highest dark:border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
                <span>Mathematical Golden Ratio margins</span>
              </div>
            </div>

            {/* Discipline 02 */}
            <div className="bg-surface-container-lowest dark:bg-[#121217] p-8 rounded-xl border border-surface-container-highest dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-white/5 flex items-center justify-center mb-6 text-primary dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[22px]">palette</span>
                </div>
                <span className="font-code-spec text-code-spec text-on-surface-variant/70 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Discipline 02
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary dark:text-[#f1effa] mb-3">
                  Style-Consistent Plates
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-neutral-300 leading-relaxed">
                  Curated multimodal diffusion bibles guarantee that every chapter woodcut, diagram, or painterly plate maintains unwavering character likeness, lighting temperatures, and paper grain fidelity.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-on-surface dark:text-[#f1effa] font-label-ui text-label-ui border-t border-surface-container-highest dark:border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
                <span>Deterministic style anchoring</span>
              </div>
            </div>

            {/* Discipline 03 */}
            <div className="bg-surface-container-lowest dark:bg-[#121217] p-8 rounded-xl border border-surface-container-highest dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-white/5 flex items-center justify-center mb-6 text-primary dark:text-[#f1effa]">
                  <span className="material-symbols-outlined text-[22px]">print</span>
                </div>
                <span className="font-code-spec text-code-spec text-on-surface-variant/70 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Discipline 03
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary dark:text-[#f1effa] mb-3">
                  Press-Ready Press Run
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-neutral-300 leading-relaxed">
                  True spine bulk calculations based on caliper thickness, Smyth sewn signature breakdowns, PDF/X-1a CMYK color separations, and verified ISO EPUB3 digital publishing binaries.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-on-surface dark:text-[#f1effa] font-label-ui text-label-ui border-t border-surface-container-highest dark:border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
                <span>Direct IngramSpark &amp; Blurb parity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02: Interactive Typesetting Showcase (The Alchemical Transformation) */}
      <section className="w-full py-24 bg-surface-container-lowest dark:bg-[#121217]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary dark:text-[#fcba64] block mb-2">
                Live Typesetting Comparison
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary dark:text-[#f1effa] tracking-tight">
                The Alchemical Transformation
              </h2>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-surface-container-low dark:bg-white/5 border border-surface-container-highest dark:border-white/10 rounded-full shadow-inner">
              <button
                onClick={() => setViewMode('split')}
                className={`px-5 py-2 rounded-full font-label-ui text-label-ui transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-primary dark:bg-white text-on-primary dark:text-black shadow-xs'
                    : 'text-on-surface-variant dark:text-neutral-400 hover:text-on-surface'
                }`}
              >
                Comparison Spread
              </button>
              <button
                onClick={() => setViewMode('master')}
                className={`px-5 py-2 rounded-full font-label-ui text-label-ui transition-all cursor-pointer ${
                  viewMode === 'master'
                    ? 'bg-primary dark:bg-white text-on-primary dark:text-black shadow-xs'
                    : 'text-on-surface-variant dark:text-neutral-400 hover:text-on-surface'
                }`}
              >
                Master Typeset Only
              </button>
            </div>
          </div>

          {/* Spread Folio Presentation Canvas */}
          <div className="bg-surface-container-low dark:bg-[#1a1b22]/70 p-6 md:p-12 rounded-2xl border border-surface-container-highest dark:border-white/10 shadow-lg relative">
            {/* Folio Spine Shadow */}
            {viewMode === 'split' && (
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/5 via-black/10 to-transparent pointer-events-none z-10" />
            )}

            <div
              className={`grid gap-8 md:gap-0 bg-surface-container-lowest dark:bg-[#0e0e12] rounded-xl shadow-xl border border-surface-container-highest dark:border-white/10 overflow-hidden min-h-[520px] ${
                viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'
              }`}
            >
              {/* Left Leaf: Raw Manuscript Draft */}
              {viewMode === 'split' && (
                <div className="p-8 md:p-14 flex flex-col justify-between bg-surface-container-lowest dark:bg-[#0e0e12] border-b md:border-b-0 md:border-r border-surface-container-highest dark:border-white/10 relative">
                  <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-highest dark:border-white/10">
                      <span className="font-code-spec text-code-spec text-on-surface-variant dark:text-neutral-400 tracking-wider uppercase">
                        Input Manuscript • Raw Text
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-neutral-300 font-label-caps text-label-caps">
                        Raw LLM Output
                      </span>
                    </div>
                    <p className="font-mono text-[13px] text-on-surface-variant/80 dark:text-neutral-400 leading-relaxed mb-6">
                      # Chapter IV: The Architecture of Resonance<br /><br />
                      We entered the atrium as the northern dusk broke upon the clerestory glass. There were no columns to interrupt the silence, merely the sweeping parabolic arcs cast by reinforced basalt. Elena unrolled the survey maps across the marble altar.
                    </p>
                    <p className="font-mono text-[13px] text-on-surface-variant/80 dark:text-neutral-400 leading-relaxed">
                      &quot;The acoustics will preserve even a sigh,&quot; she murmured, tracing the damp relief of the foundation piers. &quot;If the engine fires tonight, the harmonic vibration will be heard all the way across the fjord.&quot;
                    </p>
                  </div>
                  <div className="pt-8 flex items-center justify-between text-on-surface-variant/60 dark:text-neutral-500 font-code-spec text-code-spec border-t border-surface-container-highest dark:border-white/10">
                    <span>Standard line-breaks • Ragged right</span>
                    <span>120 wpm read tempo</span>
                  </div>
                </div>
              )}

              {/* Right Leaf: Collector Master Typeset Leaf */}
              <div className="p-8 md:p-14 flex flex-col justify-between bg-[#faf7f0] dark:bg-[#18181f] text-[#1a1b22] dark:text-[#f1effa] relative">
                {/* Archival watermark plate */}
                <div className="absolute right-8 top-10 w-24 h-24 rounded-full bg-secondary/5 blur-xl pointer-events-none" />

                <div>
                  {/* Running Head with Folio Number */}
                  <div className="flex items-center justify-between mb-10 pb-2 border-b border-black/5 dark:border-white/10">
                    <span className="font-code-spec text-code-spec text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                      BookGenie • Archetypes
                    </span>
                    <span className="font-code-spec text-code-spec font-semibold">147</span>
                  </div>

                  {/* Chapter Title */}
                  <div className="text-center mb-8">
                    <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary dark:text-[#fcba64] block mb-1">
                      Chapter Four
                    </span>
                    <h4 className="font-headline-sm text-headline-sm tracking-tight">
                      The Architecture of Resonance
                    </h4>
                  </div>

                  {/* Typeset Paragraph with Classical Drop Cap */}
                  <div className="relative text-justify font-serif text-[16px] sm:text-[17px] leading-[28px] tracking-[-0.01em]">
                    <span className="float-left text-[56px] leading-[48px] pt-1 pr-3 font-serif font-medium text-primary dark:text-[#fcba64] select-none">
                      W
                    </span>
                    <span className="tracking-wide">e entered the atrium as the northern dusk</span> broke upon the clerestory glass. There were no columns to interrupt the immaculate silence, merely the sweeping parabolic arcs cast by reinforced basalt. Elena unrolled the survey maps across the marble altar.
                    <p className="mt-4 indent-6">
                      “The acoustics will preserve even a sigh,” she murmured, tracing the damp relief of the foundation piers with delicate reverence. “If the engine fires tonight, the harmonic vibration will travel unhindered across the frozen fjord.”
                    </p>
                  </div>
                </div>

                {/* Footer Leaf Signature */}
                <div className="pt-8 flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-code-spec text-code-spec border-t border-black/5 dark:border-white/10">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#fcba64]" />
                    <span>Knuth-Plass Balanced • 0 Overflows</span>
                  </span>
                  <span>Signature D / Sheet 12</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
