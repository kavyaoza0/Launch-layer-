import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../ThemeContext';
import Magnetic from './Magnetic';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Magnetic strength={0.3}>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`group relative flex items-center gap-2.5 p-1.5 sm:p-2 rounded-full border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 shadow-sm cursor-pointer outline-none ${className}`}
      >
        <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center overflow-hidden">
          {/* Sun Icon */}
          <motion.svg
            initial={false}
            animate={{
              scale: isDark ? 0 : 1,
              rotate: isDark ? 90 : 0,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-4 h-4 text-[#0A0A0A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </motion.svg>

          {/* Moon Icon */}
          <motion.svg
            initial={false}
            animate={{
              scale: isDark ? 1 : 0,
              rotate: isDark ? 0 : -90,
              opacity: isDark ? 1 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-4 h-4 text-[#F9F8F6]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </motion.svg>
        </div>

        {showLabel && (
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] pr-2 text-black/60 dark:text-white/60 font-medium">
            {isDark ? 'Dark' : 'Light'}
          </span>
        )}
      </button>
    </Magnetic>
  );
};

export default ThemeToggle;
