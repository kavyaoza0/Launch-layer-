import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { playChime } from '../utils/sound';

interface MarqueeProps {
  className?: string;
  speed?: number;
}

const MARQUEE_ITEMS = [
  'Custom Web Design',
  'Fast Load Speeds',
  'Mobile Friendly',
  'Clean & Modern Code',
  'Smooth Animations',
  'Thoughtful Typography',
  'Direct 1-on-1 Work',
  'Honest Communication',
];

export const Marquee: React.FC<MarqueeProps> = ({
  className = '',
  speed = 36,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden py-4 sm:py-6 border-y border-black/[0.08] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.015] backdrop-blur-md select-none transition-colors duration-400 group/marquee ${className}`}
      aria-label="Capabilities Marquee"
    >
      {/* Subtle border light beam - Top laser trace */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden pointer-events-none z-20">
        <div 
          className="marquee-laser marquee-laser-1 pause-on-scroll w-48 sm:w-80 h-full bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent blur-[0.5px]"
        />
      </div>

      {/* Subtle border light beam - Bottom laser trace (offset & reverse direction) */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none z-20">
        <div 
          className="marquee-laser marquee-laser-2 pause-on-scroll w-40 sm:w-72 h-full bg-gradient-to-r from-transparent via-emerald-400/75 to-transparent blur-[0.5px]"
        />
      </div>

      {/* Ambient kinetic background shimmer */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none opacity-5 pause-on-scroll"
      />

      {/* Soft gradient edge roll-offs */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F9F8F6] dark:from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F9F8F6] dark:from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      {/* GPU hardware-accelerated ticker container */}
      <div className="transform-gpu origin-center">
        {/* Continuous Infinite Ticker with GPU hardware animation */}
        <div
          className="marquee-ticker flex whitespace-nowrap transform-gpu w-fit items-center"
          style={{ animationDuration: `${speed}s` }}
        >
          {[...Array(4)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-6 sm:gap-9 md:gap-12 px-3 sm:px-6">
              {MARQUEE_ITEMS.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-6 sm:gap-9 md:gap-12">
                  <motion.div
                    whileHover={{ scale: 1.06, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onMouseEnter={() => playChime(itemIdx % 6)}
                    className="group/item relative px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-black/[0.06] dark:border-white/[0.08] hover:border-emerald-500/40 dark:hover:border-emerald-400/40 bg-black/[0.02] dark:bg-white/[0.03] hover:bg-emerald-500/[0.05] dark:hover:bg-emerald-400/[0.08] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-emerald-500/10"
                  >
                    {/* Hover Glow Aura behind pill */}
                    <div className="absolute -inset-1 rounded-full bg-emerald-500/0 group-hover/item:bg-emerald-500/10 blur-sm transition-all duration-300 pointer-events-none" />

                    <span className="relative z-10 text-xs sm:text-sm font-mono uppercase tracking-[0.22em] sm:tracking-[0.25em] text-black/75 dark:text-white/75 group-hover/item:text-black dark:group-hover/item:white transition-colors font-medium">
                      {item}
                    </span>
                  </motion.div>

                  {/* Kinetic rotating star glyph (hardware-composited CSS spin) */}
                  <span className="inline-block text-emerald-500/80 text-xs sm:text-sm select-none animate-[spin_16s_linear_infinite] will-change-transform">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
