import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useSectionReveal } from '../hooks/useSectionReveal';

interface MetricItem {
  display: string;
  label: string;
  description: string;
}

const METRICS: MetricItem[] = [
  {
    display: '99.8%',
    label: 'Google PageSpeed',
    description: 'Clean, lightweight code so your pages load almost instantly.',
  },
  {
    display: '<0.35s',
    label: 'Load Times',
    description: 'Under half a second on mobile networks so visitors never wait.',
  },
  {
    display: '14+',
    label: 'Projects Launched',
    description: 'Websites and web apps delivered for founders worldwide.',
  },
  {
    display: '100%',
    label: 'Direct 1-on-1 Help',
    description: 'You work directly with me with clear updates every step of the way.',
  },
];

export const Metrics: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
  const { ref: sectionRef, isVisible } = useSectionReveal<HTMLElement>({
    threshold: 0.3,
    once: true,
    staggerInterval: 90,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen, { passive: true });
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Organic spring physics configuration
  const springTransition = {
    type: 'spring' as const,
    damping: 18,
    stiffness: 70,
    mass: 0.85,
  };

  return (
    <section 
      ref={sectionRef}
      id="metrics"
      data-reveal-section
      className={`py-12 sm:py-18 md:py-24 lg:py-32 bg-transparent border-t border-black/[0.06] dark:border-white/[0.08] relative z-10 transition-colors duration-400 section-reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8">
          <div>
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 sm:gap-6 mb-3 sm:mb-5"
            >
              <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.25em] text-black/70 dark:text-white/70 font-semibold">
                Standards · What You Get
              </span>
              <div className="h-px w-10 sm:w-16 bg-black/15 dark:bg-white/20"></div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-7xl font-serif italic font-normal text-[#0A0A0A] dark:text-[#F9F8F6] tracking-normal leading-[1.08]"
            >
              Built with <br />
              <span className="not-italic font-syne font-extrabold uppercase text-black/40 dark:text-white/45 block mt-0.5 sm:mt-1.5 text-2xl sm:text-4xl md:text-5xl">
                Care.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg md:text-xl text-black/75 dark:text-white/75 font-normal max-w-md leading-relaxed"
          >
            Every website is handcrafted with clean code, fast loading speeds, and careful attention to how real people browse.
          </motion.p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-10 border-t border-black/[0.08] dark:border-white/[0.08]">
          {METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[200px] sm:min-h-[240px] group transition-all duration-400 hover:-translate-y-2 hover:border-black/20 dark:hover:border-white/25 hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_24px_50px_rgba(0,0,0,0.6)] cursor-default overflow-hidden will-change-transform"
            >
              {/* Delicate Top Border Accent Shimmer on Hover */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-black/50 dark:text-white/50 font-semibold">
                  0{idx + 1}.
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/35 group-hover:bg-emerald-500 group-hover:scale-125 transition-all duration-300" />
              </div>

              <div className="my-3 sm:my-4">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-serif italic font-semibold text-[#0A0A0A] dark:text-[#F9F8F6] tracking-tight leading-none group-hover:text-black dark:group-hover:text-white transition-colors">
                  {metric.display}
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em] text-black/85 dark:text-white/85 font-semibold mt-2.5">
                  {metric.label}
                </h3>
              </div>

              <p className="text-xs sm:text-sm md:text-base text-black/65 dark:text-white/65 font-normal leading-relaxed">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Metrics;
