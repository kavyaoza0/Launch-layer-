import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../ThemeContext';

interface CustomCursorProps {
  loading?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ loading = false }) => {
  const { theme } = useTheme();
  const isGlobalDark = theme === 'dark';

  const [isFinePointer, setIsFinePointer] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const lastTargetRef = useRef<EventTarget | null>(null);

  // Direct mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-frequency center dot spring (ultra-snappy, razor-sharp 1:1 feel)
  const dotSpringConfig = { damping: 52, stiffness: 1400, mass: 0.06 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  // Silky, liquid trailing halo spring
  const haloSpringConfig = { damping: 30, stiffness: 340, mass: 0.18 };
  const haloX = useSpring(mouseX, haloSpringConfig);
  const haloY = useSpring(mouseY, haloSpringConfig);

  const inspectElement = useCallback((element: HTMLElement | null) => {
    if (!element) {
      setIsHovered(false);
      setIsTextInput(false);
      return;
    }

    // Check if pointer is over text inputs
    const inputTarget = element.closest('input, textarea, [contenteditable="true"]');
    if (inputTarget) {
      setIsTextInput(true);
      setIsHovered(false);
      return;
    }

    setIsTextInput(false);

    // Check if pointer is over interactive targets (buttons, links, clickable items)
    const interactiveTarget = element.closest<HTMLElement>(
      'button, a, [role="button"], .cursor-pointer, .premium-link, [data-interactive]'
    );

    setIsHovered(Boolean(interactiveTarget));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
      if (!e.matches) setIsVisible(false);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    // If on a touch device, do not attach mouse or touch listeners
    if (!mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Only inspect DOM when mouse crosses onto a different element (zero scroll penalty)
      if (e.target !== lastTargetRef.current) {
        lastTargetRef.current = e.target;
        inspectElement(e.target as HTMLElement | null);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, inspectElement]);

  // Synchronize scoped custom-cursor-active class to hide native cursor ONLY while custom cursor is actively tracking
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isVisible && isFinePointer) {
      document.documentElement.classList.add('custom-cursor-active');
    } else {
      document.documentElement.classList.remove('custom-cursor-active');
    }
    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isVisible, isFinePointer]);

  // Don't render cursor markup at all on touch/mobile devices
  if (isFinePointer === false) {
    return null;
  }

  const effectiveDark = isGlobalDark;

  // Compute visual appearance without layout thrashing
  const getHaloAppearance = () => {
    if (isHovered) {
      return {
        borderColor: effectiveDark ? '#34D399' : '#10B981',
        backgroundColor: effectiveDark ? 'rgba(52, 211, 153, 0.16)' : 'rgba(16, 185, 129, 0.12)',
        boxShadow: effectiveDark
          ? '0 0 20px rgba(52, 211, 153, 0.3)'
          : '0 0 16px rgba(16, 185, 129, 0.2)',
      };
    }

    if (effectiveDark) {
      return {
        borderColor: 'rgba(255, 255, 255, 0.55)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: 'none',
      };
    }

    return {
      borderColor: 'rgba(10, 10, 10, 0.45)',
      backgroundColor: 'rgba(10, 10, 10, 0.04)',
      boxShadow: 'none',
    };
  };

  const haloAppearance = getHaloAppearance();
  const dotColor = isHovered 
    ? (effectiveDark ? '#34D399' : '#10B981') 
    : (effectiveDark ? '#FFFFFF' : '#0A0A0A');

  // Hardware-accelerated scale factor
  const haloScale = loading || !isVisible || isTextInput 
    ? 0 
    : isMouseDown 
      ? 0.85 
      : isHovered 
        ? 1.5 
        : 1;

  const dotScale = loading || !isVisible || isTextInput 
    ? 0 
    : isMouseDown 
      ? 0.75 
      : isHovered 
        ? 1.25 
        : 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Outer Liquid Trailing Halo (Fixed 38px diameter, hardware scale transform) */}
      <motion.div
        style={{
          x: haloX,
          y: haloY,
          top: 0,
          left: 0,
          translateX: '-50%',
          translateY: '-50%',
          width: 38,
          height: 38,
        }}
        animate={{
          scale: haloScale,
          opacity: loading || !isVisible || isTextInput ? 0 : 1,
          borderColor: isHovered ? (effectiveDark ? '#34D399' : '#10B981') : haloAppearance.borderColor,
          backgroundColor: isHovered ? (effectiveDark ? 'rgba(52, 211, 153, 0.22)' : 'rgba(16, 185, 129, 0.18)') : haloAppearance.backgroundColor,
          boxShadow: isHovered 
            ? '0 0 24px rgba(52, 211, 153, 0.65), inset 0 0 10px rgba(52, 211, 153, 0.3)'
            : haloAppearance.boxShadow,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 450, damping: 30, mass: 0.15 },
          opacity: { duration: 0.15, ease: 'easeOut' },
          borderColor: { duration: 0.2, ease: 'easeOut' },
          backgroundColor: { duration: 0.2, ease: 'easeOut' },
          boxShadow: { duration: 0.2, ease: 'easeOut' },
        }}
        className="fixed rounded-full border-[1.5px] pointer-events-none will-change-transform"
      />

      {/* Inner Precision Center Dot with High-Contrast Dual Ring (Always 100% visible) */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          top: 0,
          left: 0,
          translateX: '-50%',
          translateY: '-50%',
          width: 9,
          height: 9,
        }}
        animate={{
          scale: dotScale,
          opacity: loading || !isVisible || isTextInput ? 0 : 1,
          backgroundColor: isHovered ? '#10B981' : (effectiveDark ? '#FFFFFF' : '#0A0A0A'),
          boxShadow: isHovered
            ? '0 0 0 2px #FFFFFF, 0 0 14px rgba(16, 185, 129, 0.95), 0 2px 6px rgba(0,0,0,0.4)'
            : (effectiveDark
              ? '0 0 0 1.5px rgba(0, 0, 0, 0.85), 0 0 8px rgba(255, 255, 255, 0.6)'
              : '0 0 0 1.5px rgba(255, 255, 255, 0.95), 0 0 8px rgba(0, 0, 0, 0.4)'),
        }}
        transition={{
          scale: { type: 'spring', stiffness: 500, damping: 28, mass: 0.1 },
          opacity: { duration: 0.15, ease: 'easeOut' },
          backgroundColor: { duration: 0.2, ease: 'easeOut' },
        }}
        className="fixed rounded-full pointer-events-none will-change-transform z-10"
      />
    </div>
  );
};

export default CustomCursor;
