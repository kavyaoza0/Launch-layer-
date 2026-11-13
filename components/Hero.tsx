import React, { useRef } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import Magnetic from './Magnetic';
import { useTheme } from '../ThemeContext';
import { playChime } from '../utils/sound';

interface BioToken {
  text: string;
  isSpecial?: boolean;
}

const BIO_TOKENS: BioToken[] = [
  { text: "I" },
  { text: "build" },
  { text: "fast,", isSpecial: true },
  { text: "clean,", isSpecial: true },
  { text: "and", isSpecial: true },
  { text: "thoughtful", isSpecial: true },
  { text: "websites", isSpecial: true },
  { text: "for" },
  { text: "founders" },
  { text: "and" },
  { text: "independent" },
  { text: "businesses." },
  { text: "No" },
  { text: "agency" },
  { text: "fluff" },
  { text: "or" },
  { text: "tech" },
  { text: "jargon—just" },
  { text: "honest" },
  { text: "craft" },
  { text: "that" },
  { text: "looks" },
  { text: "great," },
  { text: "feels" },
  { text: "smooth," },
  { text: "and" },
  { text: "helps" },
  { text: "your" },
  { text: "business" },
  { text: "grow." },
];

const BIO_CHIME_INDEXES: Record<string, number> = {
  'fast,': 0,
  'clean,': 1,
  'and': 2,
  'thoughtful': 3,
  'websites': 5,
};

// Staggered orchestration container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

// Smooth elevation easing for tags and utility elements
const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 24,
  },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Staggered headline lines container
const headlineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.32,
      delayChildren: 0.12,
    },
  },
};

// Line container that cascades child words
const headlineLineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
    },
  },
};

// Elegant, hardware-accelerated entrance for headline words
const headlineWordVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    scale: 0.97,
  },
  visible: {
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Staggered container for introductory bio paragraph words
const bioContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.024,
      delayChildren: 0.35,
    },
  },
};

// Smooth, fluid opacity and elevation reveal for bio words
const bioWordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const shouldReduceMotion = useReducedMotion();

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const renderHeadlineWords = (text: string, fontClasses: string) => {
    return text.trim().split(/\s+/).map((word, idx) => (
      <motion.span
        key={`${word}-${idx}`}
        variants={shouldReduceMotion ? undefined : headlineWordVariants}
        className={`inline-block mr-[0.2em] last:mr-0 will-change-[transform,filter,opacity] ${fontClasses}`}
      >
        {word}
      </motion.span>
    ));
  };

  return (
    <section 
      ref={containerRef}
      id="hero"
      className="min-h-0 sm:min-h-[80vh] flex flex-col justify-between px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative bg-transparent transition-colors duration-400 overflow-hidden"
    >
      {/* Subtle Background Accent & Soft Breathing Ambient Aura */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] pointer-events-none -z-10" 
        style={{ 
          backgroundImage: `radial-gradient(circle, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }}
      />
      
      {/* Editorial Ambient Aura */}
      <motion.div
        animate={{
          opacity: isDark ? [0.12, 0.22, 0.12] : [0.04, 0.08, 0.04],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 right-1/4 w-[400px] sm:w-[600px] h-[280px] sm:h-[380px] rounded-full blur-md sm:blur-lg pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/18 via-emerald-500/5 to-transparent dark:from-emerald-500/15 dark:via-white/5 dark:to-transparent"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex-grow flex flex-col justify-between"
      >
        <div className="max-w-screen-2xl mx-auto w-full relative z-10 flex-grow flex flex-col justify-center my-auto">
          
          {/* Simple Status & Location Tag */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 md:mb-10"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em] text-black/75 dark:text-white/75 font-medium">
                Web Design & Development
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em] text-black/50 dark:text-white/50">
              Ahmedabad · Available Worldwide
            </span>
          </motion.div>
          
          {/* Main Headline with Staggered Word Reveal */}
          <motion.div 
            variants={headlineContainerVariants}
            className="mb-8 sm:mb-12 md:mb-14 max-w-full origin-left"
          >
            <h1 className="leading-[1.12] sm:leading-[1.06] lg:leading-[1.02]">
              {/* Line 1: "Better" in luxury aesthetic Cormorant Garamond italic */}
              <motion.div 
                variants={headlineLineContainerVariants}
                className="py-0.5 sm:py-1"
              >
                <span className="block leading-[1.05]">
                  {renderHeadlineWords(
                    "Better",
                    "font-serif italic font-normal text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[8rem] text-[#0A0A0A] dark:text-[#F9F8F6] tracking-normal"
                  )}
                </span>
              </motion.div>

              {/* Line 2: "Experiences." with Syne Extrabold reaching generously across */}
              <motion.div 
                variants={headlineLineContainerVariants}
                className="py-0.5 sm:py-1 mt-1 sm:mt-2"
              >
                <span className="block leading-[1.02]">
                  {renderHeadlineWords(
                    "Experiences.",
                    "not-italic font-syne font-extrabold uppercase tracking-tight text-[clamp(1.55rem,6.8vw,2.75rem)] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5.25rem] xl:text-[6.5rem] 2xl:text-[7.5rem] text-[#0A0A0A] dark:text-[#F9F8F6] whitespace-nowrap"
                  )}
                </span>
              </motion.div>
            </h1>
          </motion.div>

          {/* Clear, Simple Bio & Direct Actions with Interactive Tactile Bio Tokens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16 items-start mb-8 sm:mb-12 md:mb-16">
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-8 flex flex-col gap-4"
            >
              <motion.p 
                variants={bioContainerVariants}
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed max-w-3xl text-balance"
              >
                {BIO_TOKENS.map((token, index) => {
                  const isSpecial = token.isSpecial;
                  const chimeIdx = isSpecial ? (BIO_CHIME_INDEXES[token.text] ?? 2) : undefined;

                  return (
                    <motion.span
                      key={`${token.text}-${index}`}
                      variants={shouldReduceMotion ? undefined : bioWordVariants}
                      className={`inline-block mr-[0.28em] will-change-[transform,filter,opacity] ${
                        isSpecial ? 'my-0.5' : ''
                      }`}
                    >
                      {isSpecial ? (
                        <span
                          onMouseEnter={() => {
                            if (chimeIdx !== undefined) playChime(chimeIdx);
                          }}
                          className="group/tag inline-flex items-center px-2 py-0.5 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04] hover:bg-emerald-500/10 dark:hover:bg-emerald-400/15 hover:border-emerald-500/35 dark:hover:border-emerald-400/40 text-black dark:text-white font-medium italic font-serif cursor-pointer transition-all duration-300 hover:scale-[1.05] active:scale-95 shadow-2xs hover:shadow-xs"
                        >
                          <span className="relative z-10 transition-colors group-hover/tag:text-emerald-700 dark:group-hover/tag:text-emerald-300">
                            {token.text}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover/tag:opacity-100 transition-opacity ml-1" />
                        </span>
                      ) : (
                        <span className="text-black/80 dark:text-white/85">
                          {token.text}
                        </span>
                      )}
                    </motion.span>
                  );
                })}
              </motion.p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-4 flex flex-wrap sm:flex-nowrap lg:flex-col gap-3 sm:gap-4 lg:items-end pt-1"
            >
              <Magnetic strength={0.18}>
                <button 
                  onClick={scrollToWork}
                  onMouseEnter={() => playChime(1)}
                  className="group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-between gap-4 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all duration-300 cursor-pointer text-left shadow-sm active:scale-[0.98]"
                >
                  {/* Subtle Light Shimmer Sweep */}
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                  <span className="relative z-10 text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em] font-semibold">
                    See Recent Projects
                  </span>
                  <span className="relative z-10 text-sm font-mono group-hover:translate-y-0.5 transition-transform duration-200">↓</span>
                </button>
              </Magnetic>

              {/* Aesthetic & Premium "Start a Dialogue" Button */}
              <Magnetic strength={0.18}>
                <button 
                  onClick={scrollToContact}
                  onMouseEnter={() => playChime(4)}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-3.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-black/15 dark:border-white/20 bg-white/95 dark:bg-[#141414] text-[#0A0A0A] dark:text-[#F9F8F6] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
                  aria-label="Start a Dialogue"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors animate-pulse" />
                    <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] font-semibold">
                      Start a Dialogue
                    </span>
                  </div>
                  
                  <div className="w-6 h-6 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.08] group-hover:bg-white/20 dark:group-hover:bg-black/20 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5">
                    <svg className="w-3 h-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </button>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        {/* Clean Hero Footer with Subtle Scroll Indicator */}
        <motion.div 
          variants={itemVariants}
          className="w-full pt-4 sm:pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-black/55 dark:text-white/55 text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em]"
        >
          <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
            {['LinkedIn', 'Twitter', 'GitHub'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="transition-colors hover:text-black dark:hover:text-white py-0.5"
              >
                {social}
              </a>
            ))}
          </div>

          {/* Minimalist Micro Scroll Indicator */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono tracking-[0.22em] text-black/40 dark:text-white/40">
            <span>Scroll</span>
            <div className="w-px h-5 bg-black/15 dark:bg-white/20 relative overflow-hidden">
              <motion.div 
                className="w-full h-2 bg-emerald-500/80 dark:bg-emerald-400/80"
                animate={{ y: [-8, 22] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <div className="opacity-70">
            <span>© 2025 LaunchLayer · Handcrafted Web Studio</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
