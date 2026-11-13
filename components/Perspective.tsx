import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import Magnetic from './Magnetic';
import { playChime } from '../utils/sound';
import { useSectionReveal } from '../hooks/useSectionReveal';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Working with LaunchLayer was the best decision for our launch. The site is super fast, easy to navigate, and inquiries started coming in during our first week.",
    author: "Elena Vance",
    role: "Founder & Creative Director",
    company: "Aura Skincare"
  },
  {
    quote: "The care given to tiny details, smooth scrolling, and mobile layouts was incredible. Easily the smoothest web project experience I've had.",
    author: "Marcus Lindqvist",
    role: "Principal Architect",
    company: "Verve Studio"
  },
  {
    quote: "Clear communication, quick turnarounds, and completely understood what we needed without endless meetings. Our clients love the new site.",
    author: "Julian Thorne",
    role: "Head of Product",
    company: "Nexus Tech"
  }
];

export const Perspective: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-350, 350], [-3.8, 3.8]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen, { passive: true });
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const { ref: sectionRef, isVisible } = useSectionReveal<HTMLElement>({
    threshold: 0.3,
    once: true,
    staggerInterval: 90,
  });

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveTestimonial(prev => {
      const nextIndex = newDirection > 0
        ? (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1)
        : (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1);
      playChime(nextIndex);
      return nextIndex;
    });
  };

  const setIndexDirect = (index: number) => {
    if (index === activeTestimonial) return;
    setDirection(index > activeTestimonial ? 1 : -1);
    setActiveTestimonial(index);
    playChime(index);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 55;
    const velocityThreshold = 280;
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      paginate(1);
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      paginate(-1);
    }
  };

  // Organic spring physics for horizontal slide
  // Organic spring physics for horizontal slide (hardware accelerated)
  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 80 : -80,
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: shouldReduceMotion
        ? { duration: 0.3 }
        : {
            type: 'spring' as const,
            stiffness: 280,
            damping: 28,
            mass: 0.85,
          },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -80 : 80,
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.97,
      transition: shouldReduceMotion
        ? { duration: 0.25 }
        : {
            type: 'spring' as const,
            stiffness: 280,
            damping: 28,
            mass: 0.85,
          },
    }),
  };

  return (
    <section 
      ref={sectionRef}
      id="perspective"
      data-reveal-section
      className={`py-14 sm:py-20 md:py-28 bg-transparent text-[#0A0A0A] dark:text-[#F9F8F6] relative z-10 transition-colors duration-400 border-t border-black/[0.06] dark:border-white/[0.08] section-reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32 relative z-10">
        
        {/* Header Tag */}
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-10 md:mb-14"
        >
          <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.25em] text-black/70 dark:text-white/70 font-semibold">
            Client Experiences · Working Philosophy
          </span>
          <div className="h-px w-10 sm:w-16 bg-black/15 dark:bg-white/20"></div>
        </motion.div>

        {/* Large Editorial Quote */}
        <div className="max-w-5xl mb-12 sm:mb-20">
          <motion.blockquote 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic leading-relaxed sm:leading-[1.38] text-black/90 dark:text-white/95 font-normal tracking-normal text-balance"
          >
            "A good website should never feel crowded, sluggish, or confusing. It should load <span className="text-black dark:text-white not-italic font-syne font-bold tracking-normal">lightning fast</span>, be easy to read, and feel like a joy to <span className="text-emerald-600 dark:text-emerald-400 font-serif italic font-normal">use.</span>"
          </motion.blockquote>

          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-black/10 dark:border-white/15 flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-6"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm sm:text-base md:text-lg font-sans font-medium text-black dark:text-white">Direct Collaboration</span>
              <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em] text-black/60 dark:text-white/60">Clear Communication · Handcrafted Quality</span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em] text-black/80 dark:text-white/80 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Smooth on Every Screen</span>
            </div>
          </motion.div>
        </div>

        {/* Selected Client Words / Endorsements with Tactile Drag Carousel */}
        <div className="pt-8 sm:pt-12 border-t border-black/10 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.2em] text-black/80 dark:text-white/80 font-semibold">
                Client Experiences · Kind Words
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-black/45 dark:text-white/45">
                [DRAG OR SWIPE]
              </span>
            </div>
            
            {/* Interactive Magnetic Controls */}
            <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
              <Magnetic strength={0.35} tilt={true}>
                <button
                  onClick={() => paginate(-1)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/15 dark:border-white/15 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white flex items-center justify-center text-sm transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation shadow-2xs"
                  aria-label="Previous Testimonial"
                >
                  ←
                </button>
              </Magnetic>

              {/* Minimalist Tabular Counter & Interactive Progress Dots */}
              <div className="flex items-center gap-2.5 px-1.5">
                <div className="flex items-center gap-1.5">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndexDirect(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeTestimonial === i
                          ? 'w-6 bg-black dark:bg-white'
                          : 'w-1.5 bg-black/20 dark:bg-white/25 hover:bg-black/50 dark:hover:bg-white/50'
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-mono text-black/60 dark:text-white/60 tabular-nums">
                  0{activeTestimonial + 1} / 0{TESTIMONIALS.length}
                </span>
              </div>

              <Magnetic strength={0.35} tilt={true}>
                <button
                  onClick={() => paginate(1)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/15 dark:border-white/15 hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white flex items-center justify-center text-sm transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation shadow-2xs"
                  aria-label="Next Testimonial"
                >
                  →
                </button>
              </Magnetic>
            </div>
          </div>

          {/* Smooth Horizontal Spring Slide Card with Tactile Drag Gesture */}
          <div className="overflow-hidden relative max-w-4xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeTestimonial}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  x: dragX,
                  rotate: shouldReduceMotion ? 0 : dragRotate,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.32}
                dragMomentum={true}
                dragTransition={{
                  bounceStiffness: 180,
                  bounceDamping: 24,
                  power: 0.22,
                  timeConstant: 320,
                  restDelta: 0.5,
                }}
                onDragEnd={handleDragEnd}
                className="relative p-6 sm:p-8 md:p-11 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y select-none will-change-transform"
              >
                {/* Subtle Ambient Top Border Shimmer */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden pointer-events-none">
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="w-1/3 h-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
                  />
                </div>

                {/* Animated Editorial Quotation Watermark */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.88, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true" 
                  className="absolute right-6 sm:right-9 top-2 sm:top-4 text-7xl sm:text-9xl font-serif italic text-black/[0.04] dark:text-white/[0.05] select-none pointer-events-none leading-none"
                >
                  “
                </motion.div>

                <p className="relative z-10 text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-black/90 dark:text-white/95 leading-relaxed sm:leading-[1.5] mb-6 sm:mb-8 text-balance">
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </p>
                
                <div className="relative z-10 flex items-center justify-between pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex-wrap gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs">
                      {TESTIMONIALS[activeTestimonial].author.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base md:text-lg font-medium text-black dark:text-white">
                        {TESTIMONIALS[activeTestimonial].author}
                      </h5>
                      <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 font-mono tracking-wide mt-0.5">
                        {TESTIMONIALS[activeTestimonial].role} · {TESTIMONIALS[activeTestimonial].company}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-black/50 dark:text-white/50">
                    {TESTIMONIALS[activeTestimonial].company}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Perspective;
