import React, { useEffect, useRef, useState, useCallback, type RefObject } from 'react';

export interface UseSectionRevealOptions {
  /**
   * Intersection threshold (0.0 - 1.0). Default is 0.3 (30% visible per user preference)
   */
  threshold?: number;
  /**
   * Root margin string (e.g. '0px', '-50px')
   */
  rootMargin?: string;
  /**
   * Whether to trigger once and persist visibly. Default is true
   */
  once?: boolean;
  /**
   * Delay increment between staggered children in milliseconds. Default is 90ms
   */
  staggerInterval?: number;
  /**
   * CSS selector for staggered content blocks within the section.
   * Default is '.reveal, .reveal-item, [data-reveal]'
   */
  selector?: string;
  /**
   * Optional callback when the section is revealed
   */
  onReveal?: (entry: IntersectionObserverEntry) => void;
}

export interface UseSectionRevealReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T | null>;
  isVisible: boolean;
  hasRevealed: boolean;
  triggerReveal: () => void;
}

/**
 * Custom hook to detect when a section enters the viewport (30% visibility)
 * and trigger the 'reveal-visible' class dynamically with hardware-accelerated
 * staggered entry animations for desktop, and instant reveals on mobile.
 */
export function useSectionReveal<T extends HTMLElement = HTMLElement>(
  options: UseSectionRevealOptions = {}
): UseSectionRevealReturn<T> {
  const {
    threshold = 0.3,
    rootMargin = '0px',
    once = true,
    staggerInterval = 90,
    selector = '.reveal, .reveal-item, [data-reveal]',
    onReveal,
  } = options;

  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [hasRevealed, setHasRevealed] = useState<boolean>(true);

  const applyStaggeredReveal = useCallback(
    (container: HTMLElement, isMobile: boolean = false) => {
      // Add reveal-visible to the container itself
      container.classList.add('reveal-visible');

      // Find all target child content blocks
      const items = Array.from(container.querySelectorAll<HTMLElement>(selector));

      if (isMobile) {
        // Mobile / touch devices: instant reveal without delay loops for ultra-smooth scrolling
        items.forEach((item) => {
          item.style.transitionDelay = '0ms';
          item.classList.add('reveal-visible');
        });
        container.style.willChange = 'auto';
        return () => {};
      }

      // Desktop: Apply staggered entry animation
      items.forEach((item, index) => {
        if (!item.style.transitionDelay && !item.getAttribute('data-custom-delay')) {
          item.style.transitionDelay = `${index * staggerInterval}ms`;
        }
        item.classList.add('reveal-visible');
      });

      // Cleanup will-change after animation finishes to free GPU memory
      const totalAnimationDuration = (items.length * staggerInterval) + 950;
      const cleanupTimer = window.setTimeout(() => {
        container.style.willChange = 'auto';
        items.forEach((item) => {
          item.style.willChange = 'auto';
        });
      }, totalAnimationDuration);

      return () => clearTimeout(cleanupTimer);
    },
    [selector, staggerInterval]
  );

  const removeReveal = useCallback(
    (container: HTMLElement) => {
      container.classList.remove('reveal-visible');
      const items = container.querySelectorAll<HTMLElement>(selector);
      items.forEach((item) => {
        item.classList.remove('reveal-visible');
        item.style.transitionDelay = '';
      });
    },
    [selector]
  );

  const triggerReveal = useCallback(() => {
    if (elementRef.current) {
      setIsVisible(true);
      setHasRevealed(true);
      const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
      applyStaggeredReveal(elementRef.current, isMobile);
    }
  }, [applyStaggeredReveal]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Fast-path 1: prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fast-path 2: Mobile & touch devices (instant reveal per user specification)
    const isMobileDevice =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);

    if (prefersReducedMotion || isMobileDevice) {
      setIsVisible(true);
      setHasRevealed(true);
      applyStaggeredReveal(el, true);
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasRevealed(true);
      applyStaggeredReveal(el, true);
      return;
    }

    // Desktop: Hardware-accelerated intersection detection at 30% visibility
    const thresholds = Array.from(
      new Set([0, 0.1, 0.2, threshold, Math.min(1, threshold + 0.1)])
    ).sort((a, b) => a - b);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          const rect = entry.boundingClientRect;
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          
          // Edge case: when a section is taller than viewport height,
          // 30% of its total height might exceed viewport height.
          // In that case, consider it reached when 30% of the viewport is filled by the section.
          const isSectionTall = rect.height > windowHeight;
          const meetsThreshold =
            ratio >= threshold ||
            (isSectionTall && entry.intersectionRect.height >= windowHeight * threshold);

          if (entry.isIntersecting && meetsThreshold) {
            setIsVisible(true);
            setHasRevealed(true);
            applyStaggeredReveal(el, false);
            onReveal?.(entry);

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once && !entry.isIntersecting) {
            setIsVisible(false);
            removeReveal(el);
          }
        });
      },
      {
        threshold: thresholds,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, applyStaggeredReveal, removeReveal, onReveal]);

  return {
    ref: elementRef,
    isVisible,
    hasRevealed,
    triggerReveal,
  };
}

/**
 * Companion hook to automatically scan and observe all sections or elements
 * marked with `data-reveal-section` or class `section-reveal` across the page.
 */
export function useAutoSectionReveal(
  containerSelector: string = '[data-reveal-section], .section-reveal',
  options: UseSectionRevealOptions = {}
) {
  const {
    threshold = 0.3,
    rootMargin = '0px',
    once = true,
    staggerInterval = 90,
    selector = '.reveal, .reveal-item, [data-reveal]',
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileDevice = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

    // Mobile & reduced motion fast path: instant reveals without observer bottleneck
    if (prefersReducedMotion || isMobileDevice || !('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>(containerSelector).forEach((sec) => {
        sec.classList.add('reveal-visible');
        sec.querySelectorAll<HTMLElement>(selector).forEach((item) => {
          item.style.transitionDelay = '0ms';
          item.classList.add('reveal-visible');
        });
      });
      return;
    }

    const thresholds = Array.from(
      new Set([0, 0.1, 0.2, threshold, Math.min(1, threshold + 0.1)])
    ).sort((a, b) => a - b);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const ratio = entry.intersectionRatio;
          const rect = entry.boundingClientRect;
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          const isSectionTall = rect.height > windowHeight;
          const meetsThreshold =
            ratio >= threshold ||
            (isSectionTall && entry.intersectionRect.height >= windowHeight * threshold);

          if (entry.isIntersecting && meetsThreshold) {
            el.classList.add('reveal-visible');
            const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
            items.forEach((item, index) => {
              if (!item.style.transitionDelay && !item.getAttribute('data-custom-delay')) {
                item.style.transitionDelay = `${index * staggerInterval}ms`;
              }
              item.classList.add('reveal-visible');
            });

            if (once) {
              observer.unobserve(el);
            }
          } else if (!once && !entry.isIntersecting) {
            el.classList.remove('reveal-visible');
            const items = el.querySelectorAll<HTMLElement>(selector);
            items.forEach((item) => {
              item.classList.remove('reveal-visible');
              item.style.transitionDelay = '';
            });
          }
        });
      },
      {
        threshold: thresholds,
        rootMargin,
      }
    );

    const targets = document.querySelectorAll<HTMLElement>(containerSelector);
    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, [containerSelector, threshold, rootMargin, once, staggerInterval, selector]);
}

export default useSectionReveal;
