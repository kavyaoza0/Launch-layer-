import React from 'react';
import { motion, type Variants } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  tag = 'div',
}) => {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: '60%',
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: '0%',
      filter: 'blur(0px)',
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const Tag = motion[tag] as typeof motion.div;

  return (
    <Tag
      className={`inline-flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] overflow-visible ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-visible py-0.5">
          <motion.span variants={child} className="inline-block will-change-transform will-change-filter">
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blurAmount?: number;
  tag?: 'div' | 'p' | 'span' | 'h2' | 'h3' | 'blockquote' | 'section';
  once?: boolean;
  margin?: string;
}

export const BlurReveal: React.FC<BlurRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.85,
  yOffset = 22,
  blurAmount = 8,
  tag = 'div',
  once = true,
  margin = '-60px',
}) => {
  const Tag = motion[tag] as typeof motion.div;

  return (
    <Tag
      initial={{
        opacity: 0,
        y: yOffset,
        filter: `blur(${blurAmount}px)`,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once, margin }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </Tag>
  );
};

export default AnimatedText;
