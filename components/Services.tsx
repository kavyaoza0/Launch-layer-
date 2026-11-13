import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SERVICES } from '../constants';
import { useSectionReveal } from '../hooks/useSectionReveal';

const Services: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
  const { ref: sectionRef, isVisible } = useSectionReveal<HTMLElement>({ 
    threshold: 0.3, 
    once: true,
    staggerInterval: 80,
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
      id="services" 
      data-reveal-section
      className={`py-14 sm:py-20 md:py-28 bg-transparent relative z-10 transition-colors duration-400 border-t border-black/[0.06] dark:border-white/[0.08] section-reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 sm:gap-6 md:gap-8 mb-2 sm:mb-4"
          >
            <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.25em] text-black/70 dark:text-white/70 font-semibold">
              Services & Pricing · Clear & Honest
            </span>
            <div className="h-px w-10 sm:w-16 md:w-20 bg-black/15 dark:bg-white/20"></div>
          </motion.div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif italic font-normal text-[#0A0A0A] dark:text-[#F9F8F6] tracking-normal leading-[1.08]">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="block"
            >
              Ways We
            </motion.div>
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-black/40 dark:text-white/45 not-italic font-syne font-extrabold uppercase tracking-tight block mt-0.5 sm:mt-1.5 text-2xl sm:text-4xl md:text-5xl"
            >
              Can Work.
            </motion.div>
          </h2>
        </div>

        {/* Services List with Staggered Organic Spring Entrance */}
        <div className="flex flex-col border-t border-black/[0.08] dark:border-white/[0.08]">
          {SERVICES.map((service, idx) => {
            const isActive = activeIndex === idx;
            return (
              <motion.div 
                key={service.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative flex flex-col border-b border-black/[0.08] dark:border-white/[0.08] transition-colors"
              >
                {/* Delicate Border Shimmer Highlight on Row Hover */}
                <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                    className="w-1/3 h-full bg-gradient-to-r from-transparent via-black/30 dark:via-white/40 to-transparent"
                  />
                </div>

                {/* Ambient Soft Glow Backdrop for Active Service */}
                {isActive && (
                  <div 
                    aria-hidden="true" 
                    className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-r from-emerald-500/[0.045] via-emerald-500/[0.015] to-transparent transition-opacity duration-700" 
                  />
                )}

                {/* Accordion Header */}
                <button 
                  onClick={() => setActiveIndex(isActive ? -1 : idx)}
                  className="w-full py-6 sm:py-8 md:py-10 flex items-center justify-between text-left outline-none cursor-pointer touch-manipulation group"
                  aria-expanded={isActive}
                >
                  <div className="flex items-center gap-4 sm:gap-8 md:gap-12 lg:gap-16">
                    <span className={`text-sm sm:text-lg md:text-2xl font-serif italic transition-colors duration-300 tabular-nums ${isActive ? 'text-black dark:text-white font-medium' : 'text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white'}`}>
                      0{idx + 1}.
                    </span>
                    <h3 className={`text-lg sm:text-2xl md:text-3xl font-sans font-medium transition-all duration-300 ${isActive ? 'text-[#0A0A0A] dark:text-[#F9F8F6] lg:translate-x-2' : 'text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white lg:group-hover:translate-x-2'}`}>
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="hidden sm:inline-block text-xs font-mono uppercase tracking-[0.16em] text-black/50 dark:text-white/50 group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">
                      Starting at {service.price}
                    </span>
                    <div 
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isActive 
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-[0_0_16px_rgba(0,0,0,0.12)] dark:shadow-[0_0_16px_rgba(255,255,255,0.2)]' 
                          : 'border-black/15 dark:border-white/20 text-black/70 dark:text-white/70 group-hover:border-black dark:group-hover:border-white group-hover:text-black dark:group-hover:text-white group-hover:scale-105'
                      }`}
                    >
                      <svg 
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isActive ? 'rotate-45' : 'rotate-0'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Accordion Content with Cascading Micro-Stagger */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 sm:pb-12 pl-0 sm:pl-[44px] md:pl-[64px] lg:pl-[88px] grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14">
                        <motion.div 
                          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={prefersReducedMotion ? { duration: 0.3 } : { ...springTransition, delay: 0.08 }}
                          className="lg:col-span-5 flex flex-col gap-4"
                        >
                          <p className="text-sm sm:text-base md:text-lg text-black/80 dark:text-white/85 font-normal leading-relaxed text-balance">
                            {service.description}
                          </p>
                          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm w-fit shadow-2xs hover:border-black/30 dark:hover:border-white/30 transition-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.16em] text-black/80 dark:text-white/90 font-medium">
                              Starting at {service.price}
                            </span>
                          </div>
                        </motion.div>
                        
                        <div className="lg:col-span-7">
                          <motion.h4 
                            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? { duration: 0.25 } : { duration: 0.35, delay: 0.1 }}
                            className="text-xs font-mono uppercase tracking-[0.2em] text-black/50 dark:text-white/50 border-b border-black/10 dark:border-white/15 pb-2 mb-3.5 font-semibold"
                          >
                            What's Included
                          </motion.h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 sm:gap-y-3">
                            {service.features.map((f, i) => (
                              <motion.li 
                                key={i} 
                                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, x: prefersReducedMotion ? 0 : -4 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                transition={
                                  prefersReducedMotion 
                                    ? { duration: 0.2, delay: i * 0.03 } 
                                    : { ...springTransition, delay: 0.12 + i * 0.045 }
                                }
                                className="flex items-start gap-2.5 text-sm sm:text-base text-black/75 dark:text-white/80 font-normal py-1 px-1.5 rounded-lg hover:bg-black/[0.025] dark:hover:bg-white/[0.035] transition-colors"
                              >
                                <span className="text-emerald-500 dark:text-emerald-400 mt-1 shrink-0">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                <span>{f}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
