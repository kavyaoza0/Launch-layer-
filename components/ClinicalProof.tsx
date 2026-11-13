import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlurReveal } from './AnimatedText';

interface ProofCase {
  id: string;
  client: string;
  category: string;
  verifiedUrl?: string;
  summary: string;
  auditDate: string;
  keyHighlight: string;
  metrics: {
    label: string;
    before: string;
    after: string;
    delta: string;
    unit?: string;
    improvementPercent: number; // For the visual comparison bar (0 - 100)
    positive: boolean;
  }[];
  quotes: {
    text: string;
    speaker: string;
    role: string;
  };
}

const PROOF_CASES: ProofCase[] = [
  {
    id: 'aura',
    client: 'Aura Skincare',
    category: 'E-Commerce & Cellular Barrier Formula',
    verifiedUrl: 'https://launchlayer-cellular-barrier-skincare.ai.studio',
    summary: 'Re-engineered the digital flagship store from a heavy template into an ultra-fast, sensory e-commerce experience.',
    auditDate: 'Verified Q3 2024 Audit',
    keyHighlight: '91% Faster Load · +142% Checkout Conversion',
    metrics: [
      {
        label: 'Mobile Page Load Time',
        before: '4.20s',
        after: '0.38s',
        delta: '-91%',
        improvementPercent: 91,
        positive: true,
      },
      {
        label: 'Google Lighthouse Performance',
        before: '48 / 100',
        after: '99 / 100',
        delta: '+51 pts',
        improvementPercent: 99,
        positive: true,
      },
      {
        label: 'Mobile Bounce Rate',
        before: '68.4%',
        after: '26.1%',
        delta: '-62%',
        improvementPercent: 78,
        positive: true,
      },
      {
        label: 'Checkout Conversion Rate',
        before: '1.20%',
        after: '2.90%',
        delta: '+142%',
        improvementPercent: 88,
        positive: true,
      },
    ],
    quotes: {
      text: 'Our bounce rate plummeted within 48 hours of launch. Customers constantly mention how effortless and soothing the site feels to buy from.',
      speaker: 'Elena Vance',
      role: 'Founder & Formulator',
    },
  },
  {
    id: 'verve',
    client: 'Verve Studio',
    category: 'Spatial Design & Architectural Practice',
    verifiedUrl: 'https://noir-alpha-six.vercel.app/',
    summary: 'Architectural portfolio overhauled from a 18MB laggy build into an instantaneous 60fps editorial showcase.',
    auditDate: 'Verified Q4 2024 Audit',
    keyHighlight: '94% Asset Reduction · +210% Inbound Inquiries',
    metrics: [
      {
        label: 'Initial Bundle Payload',
        before: '18.4 MB',
        after: '1.1 MB',
        delta: '-94%',
        improvementPercent: 94,
        positive: true,
      },
      {
        label: 'Time to Interactive (TTI)',
        before: '5.80s',
        after: '0.42s',
        delta: '-92%',
        improvementPercent: 92,
        positive: true,
      },
      {
        label: 'Frame Rate Stability',
        before: '28 FPS',
        after: '60 FPS',
        delta: 'Solid 60',
        improvementPercent: 100,
        positive: true,
      },
      {
        label: 'Monthly High-Ticket Inquiries',
        before: '4 / mo',
        after: '18 / mo',
        delta: '+350%',
        improvementPercent: 85,
        positive: true,
      },
    ],
    quotes: {
      text: 'We went from losing prospective clients because the site was chugging on mobile to winning flagship international commissions.',
      speaker: 'Marcus Lindqvist',
      role: 'Principal Architect',
    },
  },
  {
    id: 'nexus',
    client: 'Nexus Tech',
    category: 'Enterprise Data Cloud Platform',
    summary: 'Transformed complex technical documentation and demo signup into a razor-sharp, zero-latency acquisition engine.',
    auditDate: 'Verified Q1 2025 Audit',
    keyHighlight: 'Sub-45ms TTFB · 3.8× Pilot Conversion',
    metrics: [
      {
        label: 'Server Response (TTFB)',
        before: '890ms',
        after: '42ms',
        delta: '-95%',
        improvementPercent: 95,
        positive: true,
      },
      {
        label: 'Core Web Vitals',
        before: 'Failed LCP',
        after: '100% Pass',
        delta: 'All Green',
        improvementPercent: 100,
        positive: true,
      },
      {
        label: 'Enterprise Demo Requests',
        before: '2.4%',
        after: '6.8%',
        delta: '+183%',
        improvementPercent: 84,
        positive: true,
      },
      {
        label: 'Sign-up Completion Velocity',
        before: '4.8 min',
        after: '1.2 min',
        delta: '-75%',
        improvementPercent: 75,
        positive: true,
      },
    ],
    quotes: {
      text: 'Speed is credibility for an enterprise infrastructure company. LaunchLayer gave us a website that proves our technology before a word is read.',
      speaker: 'Julian Thorne',
      role: 'Head of Product',
    },
  },
];

export const ClinicalProof: React.FC = () => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const activeCase = PROOF_CASES[activeCaseIndex];

  return (
    <section
      id="proof"
      className="py-16 sm:py-24 md:py-32 bg-[#F9F8F6] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F9F8F6] relative z-10 border-t border-black/[0.06] dark:border-white/[0.08] transition-colors duration-400"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32">
        {/* Section Header with Soft Blur Entrance */}
        <div className="mb-10 sm:mb-16 md:mb-20">
          <BlurReveal delay={0} yOffset={16} blurAmount={8}>
            <div className="flex items-center gap-3 sm:gap-6 mb-3 sm:mb-5">
              <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.25em] text-black/70 dark:text-white/70 font-semibold">
                Clinical Proof · Measured Impact
              </span>
              <div className="h-px w-10 sm:w-16 bg-black/15 dark:bg-white/20" />
            </div>
          </BlurReveal>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-10">
            <BlurReveal delay={0.1} yOffset={24} blurAmount={10}>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic font-normal text-[#0A0A0A] dark:text-[#F9F8F6] tracking-tight leading-[1.08] max-w-3xl">
                Before & After. <br />
                <span className="not-italic font-syne font-extrabold uppercase text-black/40 dark:text-white/45 text-2xl sm:text-4xl md:text-5xl block mt-1">
                  Audited Performance.
                </span>
              </h2>
            </BlurReveal>

            <BlurReveal delay={0.2} yOffset={20} blurAmount={8} className="max-w-md">
              <p className="text-sm sm:text-base md:text-lg text-black/75 dark:text-white/75 font-normal leading-relaxed">
                Design without empirical performance is merely decoration. Here is the verifiable before-and-after data from real client deployments.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  100% Real Audits
                </span>
                <span className="text-xs font-mono text-black/50 dark:text-white/50 tracking-wide">
                  Lighthouse & WebPageTest
                </span>
              </div>
            </BlurReveal>
          </div>
        </div>

        {/* Case Study Selector Tabs */}
        <BlurReveal delay={0.25} yOffset={18} blurAmount={6}>
          <div className="flex flex-wrap gap-2.5 sm:gap-3 p-1.5 bg-black/[0.03] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] max-w-fit mb-8 sm:mb-12">
            {PROOF_CASES.map((item, idx) => {
              const isActive = activeCaseIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCaseIndex(idx)}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-white dark:bg-[#1C1C1E] text-black dark:text-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] font-semibold'
                      : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-black/20 dark:bg-white/20'}`} />
                  <span>{item.client}</span>
                  <span className="hidden md:inline text-[11px] opacity-60">({item.metrics[0].delta})</span>
                </button>
              );
            })}
          </div>
        </BlurReveal>

        {/* Dynamic Case Details with Soft Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 sm:space-y-10"
          >
            {/* Case Header Meta Card */}
            <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-black dark:text-white font-medium">
                      {activeCase.client}
                    </h3>
                    <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-black/70 dark:text-white/70">
                      {activeCase.category}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-black/70 dark:text-white/70 mt-2 max-w-2xl font-normal">
                    {activeCase.summary}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shrink-0">
                  <span className="text-xs font-mono text-black/50 dark:text-white/50 tracking-wider">
                    {activeCase.auditDate}
                  </span>
                  {activeCase.verifiedUrl && (
                    <a
                      href={activeCase.verifiedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity font-semibold shadow-xs"
                    >
                      <span>View Live Build</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* 4-Metric Before & After Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8">
                {activeCase.metrics.map((metric, i) => (
                  <div
                    key={metric.label}
                    className="p-5 sm:p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-black/50 dark:text-white/50 block mb-3 font-semibold">
                        0{i + 1} · {metric.label}
                      </span>

                      <div className="flex items-baseline justify-between gap-2 mb-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono text-black/40 dark:text-white/40 uppercase">Before</span>
                          <span className="text-lg sm:text-xl font-mono text-black/60 dark:text-white/60 line-through decoration-red-500/50">
                            {metric.before}
                          </span>
                        </div>
                        <span className="text-black/30 dark:text-white/30 text-sm font-mono">→</span>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">After</span>
                          <span className="text-2xl sm:text-3xl font-serif italic font-semibold text-black dark:text-white">
                            {metric.after}
                          </span>
                        </div>
                      </div>

                      {/* Visual Improvement Bar */}
                      <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden my-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.improvementPercent}%` }}
                          transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-black/[0.04] dark:border-white/[0.05]">
                      <span className="text-black/50 dark:text-white/50">Measured Delta</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {metric.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Quote from Key Founder */}
              <div className="mt-8 pt-6 sm:pt-8 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <blockquote className="text-base sm:text-lg md:text-xl font-serif italic text-black/85 dark:text-white/90 max-w-3xl leading-relaxed">
                  "{activeCase.quotes.text}"
                </blockquote>
                <div className="shrink-0 text-left md:text-right">
                  <div className="text-sm font-medium text-black dark:text-white">{activeCase.quotes.speaker}</div>
                  <div className="text-xs font-mono text-black/50 dark:text-white/50">{activeCase.quotes.role}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ClinicalProof;
