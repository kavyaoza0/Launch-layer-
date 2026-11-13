import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import Magnetic from './Magnetic';
import ThemeToggle from './ThemeToggle';
import { useSound } from '../utils/sound';

const NAV_ITEMS = [
  { label: 'Work', id: 'work', num: '01' },
  { label: 'Services', id: 'services', num: '02' },
  { label: 'Experiences', id: 'perspective', num: '03' },
  { label: 'Dialogue', id: 'contact', num: '04' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { isSoundEnabled, toggleSound, playChime } = useSound();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 35,
    restDelta: 0.001,
  });

  useEffect(() => {
    let prevScrolled = false;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== prevScrolled) {
        prevScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const topOffset = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <>
      {/* Top Editorial Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[160] pointer-events-none bg-black/[0.03] dark:bg-white/[0.05]">
        <motion.div 
          style={{ scaleX }}
          className="h-full w-full origin-left bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A] dark:from-white dark:via-white to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
        />
      </div>

      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 left-0 w-full z-[150] px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32 py-3.5 sm:py-5 flex justify-between items-center transition-all duration-300 relative ${
          scrolled || menuOpen
            ? 'bg-[#F9F8F6]/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]' 
            : 'bg-[#F9F8F6]/80 dark:bg-[#0A0A0A]/80 border-b border-transparent'
        }`}
      >
        {/* Delicate Ambient Bottom Border Shimmer when scrolled */}
        {(scrolled || menuOpen) && (
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-400/40 dark:via-emerald-400/55 to-transparent blur-[0.5px]"
            />
          </div>
        )}

        {/* Brand Logo */}
        <div className="pointer-events-auto">
          <Magnetic strength={0.2}>
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                if (menuOpen) setMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xl sm:text-2xl font-serif italic font-semibold tracking-tight outline-none hover:opacity-60 transition-opacity cursor-pointer text-[#0A0A0A] dark:text-[#F9F8F6] relative group"
            >
              <span>LaunchLayer</span>
              <span className="absolute -inset-x-2 -inset-y-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </motion.button>
          </Magnetic>
        </div>

        {/* Desktop Nav Items */}
        <div 
          onMouseLeave={() => setHoveredNav(null)}
          className="hidden sm:flex gap-4 lg:gap-6 pointer-events-auto items-center"
        >
          {NAV_ITEMS.map((item, idx) => (
            <Magnetic key={item.id} strength={0.25}>
              <motion.button 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => {
                  setHoveredNav(item.id);
                  playChime(idx);
                }}
                onClick={() => scrollTo(item.id)}
                className="group relative text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors outline-none premium-link cursor-pointer font-semibold py-1.5 px-3 rounded-full"
              >
                {hoveredNav === item.id && (
                  <motion.div 
                    layoutId="navHoverPill"
                    className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.02)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-1 left-3 right-3 h-[1px] bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.button>
            </Magnetic>
          ))}
          
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="h-3.5 w-px bg-black/10 dark:bg-white/15 mx-1"
          />

          {/* Subtle Ambient Sound Chimes Toggle */}
          <Magnetic strength={0.25}>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
              onClick={toggleSound}
              className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.03] hover:border-black/25 dark:hover:border-white/30 transition-all text-xs font-mono uppercase tracking-[0.16em] cursor-pointer text-[#0A0A0A] dark:text-[#F9F8F6] touch-manipulation active:scale-95 shadow-2xs"
              aria-label={isSoundEnabled ? "Disable ambient sound chimes" : "Enable ambient sound chimes"}
              title={isSoundEnabled ? "Sound enabled · Click to mute" : "Sound muted · Click to enable subtle chimes"}
            >
              {/* Animated Equalizer Wave Bars */}
              <div className="flex items-center gap-[2.5px] h-3">
                <motion.span
                  animate={isSoundEnabled ? { height: [3, 10, 4, 12, 3] } : { height: 3 }}
                  transition={isSoundEnabled ? { repeat: Infinity, duration: 1.1, ease: "easeInOut" } : { duration: 0.2 }}
                  className={`w-[2px] rounded-full transition-colors ${isSoundEnabled ? 'bg-emerald-500' : 'bg-black/35 dark:bg-white/35'}`}
                />
                <motion.span
                  animate={isSoundEnabled ? { height: [6, 12, 5, 8, 6] } : { height: 3 }}
                  transition={isSoundEnabled ? { repeat: Infinity, duration: 0.85, delay: 0.2, ease: "easeInOut" } : { duration: 0.2 }}
                  className={`w-[2px] rounded-full transition-colors ${isSoundEnabled ? 'bg-emerald-500' : 'bg-black/35 dark:bg-white/35'}`}
                />
                <motion.span
                  animate={isSoundEnabled ? { height: [4, 8, 12, 4, 4] } : { height: 3 }}
                  transition={isSoundEnabled ? { repeat: Infinity, duration: 1.05, delay: 0.4, ease: "easeInOut" } : { duration: 0.2 }}
                  className={`w-[2px] rounded-full transition-colors ${isSoundEnabled ? 'bg-emerald-500' : 'bg-black/35 dark:bg-white/35'}`}
                />
              </div>
              <span className={`text-[10px] sm:text-[11px] font-semibold transition-colors ${isSoundEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-black/50 dark:text-white/50'}`}>
                {isSoundEnabled ? 'Sound' : 'Muted'}
              </span>
            </motion.button>
          </Magnetic>

          {/* Theme Toggle Component */}
          <ThemeToggle />

          {/* Live Studio Availability Pill (Purely Silent, Magnetic) */}
          <Magnetic strength={0.2}>
            <motion.button 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollTo('contact')}
              className="group relative flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] font-medium px-3.5 py-1.5 rounded-full border border-emerald-500/25 dark:border-emerald-400/30 bg-emerald-500/[0.06] dark:bg-emerald-400/[0.08] hover:bg-emerald-500/[0.14] dark:hover:bg-emerald-400/[0.16] hover:border-emerald-500/40 dark:hover:border-emerald-400/50 backdrop-blur-md shadow-2xs transition-all duration-300 cursor-pointer text-[#0A0A0A] dark:text-[#F9F8F6]"
              title="Studio Active · Click to initiate project inquiry"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]"></span>
              </span>
              <span className="text-black/80 dark:text-white/85 group-hover:text-black dark:group-hover:text-white transition-colors">
                Available · 2 Slots
              </span>
            </motion.button>
          </Magnetic>
        </div>
        
        {/* Mobile Header Actions (Sound Toggle + Theme Toggle + Morphing Menu Button) */}
        <div className="sm:hidden pointer-events-auto flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1 px-2 py-1 rounded-full border border-black/10 dark:border-white/15 bg-white/90 dark:bg-white/[0.08] text-xs font-mono uppercase tracking-wider text-black/70 dark:text-white/70"
            aria-label="Toggle ambient chimes"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSoundEnabled ? 'bg-emerald-500' : 'bg-black/30 dark:bg-white/30'}`} />
            <span className="text-[10px] font-semibold">{isSoundEnabled ? 'Audio' : 'Mute'}</span>
          </button>
          <ThemeToggle />
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative flex flex-col justify-center items-center w-10 h-10 rounded-full border border-black/10 dark:border-white/15 bg-white/90 dark:bg-white/[0.08] backdrop-blur-md outline-none cursor-pointer touch-manipulation active:scale-95 shadow-sm"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            <div className="w-4 h-3.5 relative flex flex-col justify-between pointer-events-none">
              <motion.span 
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-0.5 bg-[#0A0A0A] dark:bg-[#F9F8F6] origin-center rounded-full"
              />
              <motion.span 
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full h-0.5 bg-[#0A0A0A] dark:bg-[#F9F8F6] rounded-full"
              />
              <motion.span 
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-0.5 bg-[#0A0A0A] dark:bg-[#F9F8F6] origin-center rounded-full"
              />
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay (Positioned right below navbar) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[140] bg-[#F9F8F6]/98 dark:bg-[#0A0A0A]/98 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 overflow-y-auto sm:hidden"
          >
            {/* Navigation Links */}
            <div className="flex flex-col gap-5 py-4">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-black/50 dark:text-white/50 block font-semibold pb-1 border-b border-black/[0.08] dark:border-white/[0.1]">
                Quick Menu
              </span>

              {NAV_ITEMS.map((item, idx) => (
                <motion.button 
                  key={item.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center justify-between text-left group cursor-pointer py-2 border-b border-black/[0.04] dark:border-white/[0.05] active:opacity-60 transition-opacity"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-mono text-emerald-500 font-semibold tabular-nums">
                      {item.num}.
                    </span>
                    <span className="text-3xl font-serif italic font-semibold text-[#0A0A0A] dark:text-[#F9F8F6]">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-base text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
                    →
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Footer Info */}
            <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
              <button
                onClick={() => scrollTo('contact')}
                className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/25 dark:border-emerald-400/30 bg-emerald-500/[0.06] dark:bg-emerald-400/[0.08] text-xs font-mono uppercase tracking-[0.16em] text-black/80 dark:text-white/80 active:scale-98 transition-transform text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium">Available · 2 Slots for Q2/Q3</span>
                </div>
                <span className="text-emerald-500 text-xs">→</span>
              </button>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-black/50 dark:text-white/50 font-semibold">
                  Email Me Directly
                </span>
                <a 
                  href="mailto:launchlayer.dev@gmail.com" 
                  className="text-base font-serif italic font-semibold text-[#0A0A0A] dark:text-[#F9F8F6] break-all"
                  onClick={() => setMenuOpen(false)}
                >
                  launchlayer.dev@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
