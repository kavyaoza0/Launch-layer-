import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // Distance multiplier for magnetic pull (e.g. 0.35 - 0.5)
  tilt?: boolean; // Subtle 3D perspective pitch & yaw
  tiltStrength?: number;
  innerParallax?: boolean; // Pulls internal icon/text deeper into the cursor field
  className?: string;
  as?: React.ElementType;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.4,
  tilt = false,
  tiltStrength = 10,
  innerParallax = false,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFinePointer, setIsFinePointer] = useState(true);

  // Check if device supports fine hover (desktop/mouse) vs touch screen
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsFinePointer(media.matches);

    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Raw coordinate motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawInnerX = useMotionValue(0);
  const rawInnerY = useMotionValue(0);

  // Smooth, organic spring physics for primary container
  const springConfig = { damping: 16, stiffness: 240, mass: 0.16 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  // 3D tilt springs
  const tiltSpringConfig = { damping: 20, stiffness: 220, mass: 0.2 };
  const rotateX = useSpring(rawRotateX, tiltSpringConfig);
  const rotateY = useSpring(rawRotateY, tiltSpringConfig);

  // Inner parallax springs with slightly snappier reaction for depth layering
  const innerSpringConfig = { damping: 13, stiffness: 280, mass: 0.12 };
  const innerX = useSpring(rawInnerX, innerSpringConfig);
  const innerY = useSpring(rawInnerY, innerSpringConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !isFinePointer) return;

    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Displacement from center (-1 to 1 normalized range)
    const normX = (clientX - centerX) / (rect.width / 2);
    const normY = (clientY - centerY) / (rect.height / 2);

    // Primary magnetic translation
    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;
    rawX.set(deltaX);
    rawY.set(deltaY);

    // Subtle 3D rotational tilt
    if (tilt) {
      rawRotateX.set(-normY * tiltStrength);
      rawRotateY.set(normX * tiltStrength);
    }

    // Secondary inner parallax (e.g. icon travels faster than frame)
    if (innerParallax) {
      rawInnerX.set(deltaX * 0.45);
      rawInnerY.set(deltaY * 0.45);
    }
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawInnerX.set(0);
    rawInnerY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        y,
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: tilt ? 'preserve-3d' : 'flat',
        perspective: tilt ? 600 : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      transition={{ scale: { duration: 0.15, ease: 'easeOut' } }}
      className={`inline-block ${className}`}
    >
      {innerParallax ? (
        <motion.div
          style={{
            x: innerX,
            y: innerY,
            transformStyle: tilt ? 'preserve-3d' : 'flat',
          }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default Magnetic;
