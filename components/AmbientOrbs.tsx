import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { useScrollActivity } from '../hooks/useScrollActivity';

type RGB = [number, number, number];

// Linear interpolation between two scalar numbers
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Smooth RGB interpolation between two color triples
const interpolateRgb = (c1: RGB, c2: RGB, t: number): RGB => [
  Math.round(lerp(c1[0], c2[0], t)),
  Math.round(lerp(c1[1], c2[1], t)),
  Math.round(lerp(c1[2], c2[2], t)),
];

/**
 * Three Rotating Harmonious Mood Tints across the scroll spectrum:
 * Stop 0.00 (Hero)               -> Mood 1: Signature Emerald Aurora
 * Stop 0.33 (Selected Stories)   -> Mood 2: Warm Champagne Amber
 * Stop 0.66 (Services & Persp.)  -> Mood 3: Twilight Indigo & Cobalt
 * Stop 1.00 (Metrics & Contact)  -> Mood 1: Loop back to Signature Emerald
 */
const PALETTE_ORB1: [RGB, RGB, RGB] = [
  [16, 185, 129],  // Emerald #10B981
  [245, 158, 11],  // Champagne Amber #F59E0B
  [99, 102, 241],  // Twilight Indigo #6366F1
];

const PALETTE_ORB2_DARK: [RGB, RGB, RGB] = [
  [245, 195, 130], // Warm Champagne Ivory
  [139, 92, 246],  // Royal Violet / Twilight
  [45, 212, 191],  // Ethereal Mint Aqua
];

const PALETTE_ORB2_LIGHT: [RGB, RGB, RGB] = [
  [214, 180, 140], // Soft Pearl Amber
  [165, 180, 252], // Delicate Periwinkle
  [20, 184, 166],  // Refreshing Seafoam
];

const PALETTE_ORB3: [RGB, RGB, RGB] = [
  [20, 184, 166],  // Deep Teal #14B8A6
  [217, 119, 6],   // Rich Copper Amber #D97706
  [79, 70, 229],   // Deep Royal Indigo #4F46E5
];

// Resolves color at any continuous normalized scroll progress [0..1]
const getSpectrumColor = (progress: number, palette: [RGB, RGB, RGB]): RGB => {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.333) {
    const t = p / 0.333;
    return interpolateRgb(palette[0], palette[1], t);
  } else if (p <= 0.666) {
    const t = (p - 0.333) / 0.333;
    return interpolateRgb(palette[1], palette[2], t);
  } else {
    const t = (p - 0.666) / 0.334;
    return interpolateRgb(palette[2], palette[0], t);
  }
};

export const AmbientOrbs: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const shouldReduceMotion = useReducedMotion();
  const isScrolling = useScrollActivity(140);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Global scroll observer with relaxed spring to eliminate continuous churn
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    damping: 42,
    stiffness: 60,
    mass: 1,
    restDelta: 0.002,
  });

  // Dynamic continuous gradient interpolations with native smooth multi-stop radial fade
  const orb1Bg = useTransform(smoothScrollProgress, (progress) => {
    const effectiveProgress = shouldReduceMotion ? 0 : progress;
    const [r, g, b] = getSpectrumColor(effectiveProgress, PALETTE_ORB1);
    const coreAlpha = isDark ? 0.20 : 0.085;
    const midAlpha = isDark ? 0.055 : 0.02;
    return `radial-gradient(circle, rgba(${r}, ${g}, ${b}, ${coreAlpha}) 0%, rgba(${r}, ${g}, ${b}, ${midAlpha}) 38%, transparent 70%)`;
  });

  const orb2Bg = useTransform(smoothScrollProgress, (progress) => {
    const effectiveProgress = shouldReduceMotion ? 0 : progress;
    const palette = isDark ? PALETTE_ORB2_DARK : PALETTE_ORB2_LIGHT;
    const [r, g, b] = getSpectrumColor(effectiveProgress, palette);
    const coreAlpha = isDark ? 0.12 : 0.15;
    const midAlpha = isDark ? 0.03 : 0.045;
    return `radial-gradient(circle, rgba(${r}, ${g}, ${b}, ${coreAlpha}) 0%, rgba(${r}, ${g}, ${b}, ${midAlpha}) 42%, transparent 72%)`;
  });

  const orb3Bg = useTransform(smoothScrollProgress, (progress) => {
    const effectiveProgress = shouldReduceMotion ? 0 : progress;
    const [r, g, b] = getSpectrumColor(effectiveProgress, PALETTE_ORB3);
    const coreAlpha = isDark ? 0.15 : 0.065;
    const midAlpha = isDark ? 0.04 : 0.015;
    return `radial-gradient(circle, rgba(${r}, ${g}, ${b}, ${coreAlpha}) 0%, rgba(${r}, ${g}, ${b}, ${midAlpha}) 38%, transparent 70%)`;
  });

  // Mouse tracking - only activated on desktop fine pointer devices
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mousePixelX = useMotionValue(-1000);
  const mousePixelY = useMotionValue(-1000);
  const [cursorVisible, setCursorVisible] = useState(false);

  // Responsive organic spring physics for interactive cursor light field
  const cursorSpring = { damping: 32, stiffness: 45, mass: 0.9 };
  const smoothCursorX = useSpring(mousePixelX, cursorSpring);
  const smoothCursorY = useSpring(mousePixelY, cursorSpring);

  // Gentle atmospheric parallax for desktop
  const orb1X = useSpring(useTransform(mouseX, [-1, 1], [-50, 50]), { damping: 50, stiffness: 40 });
  const orb1Y = useSpring(useTransform(mouseY, [-1, 1], [-40, 40]), { damping: 50, stiffness: 40 });

  const orb2X = useSpring(useTransform(mouseX, [-1, 1], [60, -60]), { damping: 50, stiffness: 40 });
  const orb2Y = useSpring(useTransform(mouseY, [-1, 1], [50, -50]), { damping: 50, stiffness: 40 });

  const orb3X = useSpring(useTransform(mouseX, [-1, 1], [-35, 35]), { damping: 50, stiffness: 40 });
  const orb3Y = useSpring(useTransform(mouseY, [-1, 1], [40, -40]), { damping: 50, stiffness: 40 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDevice = () => {
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const mobileWidth = window.innerWidth < 768;
      setIsFinePointer(finePointer);
      setIsMobile(mobileWidth);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice, { passive: true });

    // Only attach mousemove on fine pointer desktop devices
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!media.matches) return () => window.removeEventListener('resize', checkDevice);

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        mouseX.set(normX);
        mouseY.set(normY);

        mousePixelX.set(e.clientX);
        mousePixelY.set(e.clientY);
        setCursorVisible(true);
      });
    };

    const handleMouseLeave = () => setCursorVisible(false);
    const handleMouseEnter = () => setCursorVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, mousePixelX, mousePixelY]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none will-change-transform transform-gpu"
      aria-hidden="true"
    >
      {/* Orb 1: Primary Aura (Top Right) - Native smooth radial gradient with GPU pause-on-scroll */}
      <motion.div
        style={{
          x: isFinePointer && !isMobile ? orb1X : 0,
          y: isFinePointer && !isMobile ? orb1Y : 0,
          opacity: isDark ? 0.8 : 0.65,
        }}
        className={`absolute -top-[10%] -right-[6%] w-[480px] sm:w-[680px] md:w-[820px] h-[480px] sm:h-[680px] md:h-[820px] rounded-full transform-gpu blur-xs sm:blur-md pause-on-scroll ${
          !shouldReduceMotion && !isMobile ? 'ambient-orb-pulse ambient-orb-1-pulse' : ''
        }`}
      >
        <motion.div 
          className="w-full h-full rounded-full"
          style={{ background: orb1Bg }}
        />
      </motion.div>

      {/* Orb 2: Counterbalance Mood Harmonic (Center Left) */}
      <motion.div
        style={{
          x: isFinePointer && !isMobile ? orb2X : 0,
          y: isFinePointer && !isMobile ? orb2Y : 0,
          opacity: isDark ? 0.65 : 0.75,
        }}
        className={`absolute top-[34%] -left-[10%] w-[500px] sm:w-[720px] md:w-[850px] h-[500px] sm:h-[720px] md:h-[850px] rounded-full transform-gpu blur-xs sm:blur-md pause-on-scroll ${
          !shouldReduceMotion && !isMobile ? 'ambient-orb-pulse ambient-orb-2-pulse' : ''
        }`}
      >
        <motion.div 
          className="w-full h-full rounded-full"
          style={{ background: orb2Bg }}
        />
      </motion.div>

      {/* Orb 3: Deep Base Mood Anchor (Bottom Right) - Completely omitted on mobile to ensure 120 FPS */}
      {!isMobile && (
        <motion.div
          style={{
            x: isFinePointer ? orb3X : 0,
            y: isFinePointer ? orb3Y : 0,
            opacity: isDark ? 0.6 : 0.5,
          }}
          className={`absolute -bottom-[12%] right-[8%] w-[420px] sm:w-[600px] md:w-[750px] h-[420px] sm:h-[600px] md:h-[750px] rounded-full transform-gpu blur-xs sm:blur-md pause-on-scroll ${
            !shouldReduceMotion ? 'ambient-orb-pulse ambient-orb-3-pulse' : ''
          }`}
        >
          <motion.div 
            className="w-full h-full rounded-full"
            style={{ background: orb3Bg }}
          />
        </motion.div>
      )}

      {/* Interactive Cursor-Reactive Light Beacon - Desktop fine pointer only, zero cost on mobile or while scrolling */}
      {isFinePointer && !isMobile && !shouldReduceMotion && !isScrolling && (
        <motion.div
          style={{
            x: smoothCursorX,
            y: smoothCursorY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            opacity: cursorVisible ? (isDark ? 0.7 : 0.45) : 0,
          }}
          transition={{
            opacity: { duration: 0.3, ease: 'easeOut' },
          }}
          className="fixed top-0 left-0 w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full pointer-events-none blur-md sm:blur-lg transform-gpu will-change-transform z-1"
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.05) 35%, transparent 68%)'
                : 'radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, rgba(245, 158, 11, 0.04) 35%, transparent 68%)',
            }}
          />
        </motion.div>
      )}

      {/* Subtle Micro Film Grain Mesh for High-End Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.028] pointer-events-none hidden sm:block"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? '#fff' : '#000'} 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

export default AmbientOrbs;
