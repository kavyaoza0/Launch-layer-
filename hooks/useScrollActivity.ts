import { useState, useEffect } from 'react';

/**
 * Hook to track whether the user is actively scrolling.
 * Manages the 'is-scrolling' CSS class on document.body for zero-cost CSS optimizations
 * (e.g., pausing heavy ambient glow animations or hover interactions during high-speed flick scrolls).
 */
export function useScrollActivity(debounceMs: number = 150): boolean {
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number | null = null;
    let isCurrentlyScrolling = false;

    const onScrollStart = () => {
      if (!isCurrentlyScrolling) {
        isCurrentlyScrolling = true;
        setIsScrolling(true);
        document.body.classList.add('is-scrolling');
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        isCurrentlyScrolling = false;
        setIsScrolling(false);
        document.body.classList.remove('is-scrolling');
        timeoutId = null;
      }, debounceMs);
    };

    window.addEventListener('scroll', onScrollStart, { passive: true });
    window.addEventListener('touchmove', onScrollStart, { passive: true });
    window.addEventListener('wheel', onScrollStart, { passive: true });

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      document.body.classList.remove('is-scrolling');
      window.removeEventListener('scroll', onScrollStart);
      window.removeEventListener('touchmove', onScrollStart);
      window.removeEventListener('wheel', onScrollStart);
    };
  }, [debounceMs]);

  return isScrolling;
}

export default useScrollActivity;
