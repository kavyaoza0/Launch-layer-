import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export interface UseLenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  touchMultiplier?: number;
}

let activeLenisInstance: Lenis | null = null;

export const getLenisInstance = (): Lenis | null => activeLenisInstance;

export function useLenis(options: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: options.duration ?? 1.15,
      easing: options.easing ?? ((t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: options.smoothWheel ?? true,
      wheelMultiplier: 0.95,
      touchMultiplier: options.touchMultiplier ?? 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;
    activeLenisInstance = lenis;

    // Active scroll state tracking with 150ms debounce
    let scrollTimeout: number | null = null;
    let isCurrentlyScrolling = false;

    const handleScroll = () => {
      if (!isCurrentlyScrolling) {
        isCurrentlyScrolling = true;
        document.body.classList.add('is-scrolling');
      }

      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }

      scrollTimeout = window.setTimeout(() => {
        isCurrentlyScrolling = false;
        document.body.classList.remove('is-scrolling');
      }, 150);
    };

    lenis.on('scroll', handleScroll);

    // Synchronized RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Global interception of internal hash navigation links for smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, {
            offset: -70,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
      document.body.classList.remove('is-scrolling');
      lenis.destroy();
      lenisRef.current = null;
      if (activeLenisInstance === lenis) {
        activeLenisInstance = null;
      }
    };
  }, [options.duration, options.easing, options.smoothWheel, options.touchMultiplier]);

  return lenisRef;
}

export default useLenis;
