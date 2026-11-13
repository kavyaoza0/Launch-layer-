import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';
import Magnetic from './Magnetic';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Scroll progress for circular indicator
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 32,
    restDelta: 0.002,
  });

  // Circle dimensions: diameter = 52, radius = 23, circumference = 2 * PI * 23 ≈ 144.51
  const circumference = 2 * Math.PI * 23;
  const strokeDashoffset = useTransform(smoothProgress, [0, 1], [circumference, 0]);

  useEffect(() => {
    // Zero-overhead visibility observer using IntersectionObserver
    const heroEl = document.getElementById('hero');
    let observer: IntersectionObserver | null = null;

    if (heroEl && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          // Visible when hero is scrolled past
          setIsVisible(!entry.isIntersecting);
        },
        { rootMargin: '-60px 0px 0px 0px' }
      );
      observer.observe(heroEl);
    } else {
      let ticking = false;
      const handleScrollFallback = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            setIsVisible(window.scrollY > 400);
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener('scroll', handleScrollFallback, { passive: true });
      return () => window.removeEventListener('scroll', handleScrollFallback);
    }

    // Track rounded scroll percent on progress change
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
    });

    return () => {
      if (observer) observer.disconnect();
      unsubscribe();
    };
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 pointer-events-auto flex items-center gap-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Frosted Glass Monospace Capsule Tooltip (Expands on Hover) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 12, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.92 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/85 dark:bg-[#121212]/90 border border-black/10 dark:border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] text-xs font-mono uppercase tracking-[0.18em] select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {scrollPercent}%
                </span>
                <span className="text-black/40 dark:text-white/40">·</span>
                <span className="text-black/70 dark:text-white/70">Top</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Magnetic Floating Button with Circular Progress Track */}
          <Magnetic strength={0.3}>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              className="group relative flex items-center justify-center w-[50px] h-[50px] rounded-full backdrop-blur-xl bg-white/80 dark:bg-[#121212]/85 text-[#0A0A0A] dark:text-[#F9F8F6] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] hover:bg-white dark:hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden"
            >
              {/* Circular SVG Scroll Progress Ring */}
              <svg 
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox="0 0 52 52"
              >
                <defs>
                  <linearGradient id="scrollProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>

                {/* Background Ring Track */}
                <circle
                  cx="26"
                  cy="26"
                  r="23"
                  className="stroke-black/[0.08] dark:stroke-white/[0.12]"
                  strokeWidth="2"
                  fill="transparent"
                />

                {/* Dynamic Progress Fill */}
                <motion.circle
                  cx="26"
                  cy="26"
                  r="23"
                  stroke="url(#scrollProgressGradient)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: shouldReduceMotion ? 0 : strokeDashoffset,
                  }}
                  className="transition-all duration-75"
                />
              </svg>

              {/* Minimalist Editorial Arrow with Kinetic Hover Lift */}
              <motion.svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 ease-out group-hover:-translate-y-1 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </motion.svg>
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
