import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Magnetic from './Magnetic';
import { useSectionReveal } from '../hooks/useSectionReveal';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [studioTime, setStudioTime] = useState<string>('');
  const [visitorTime, setVisitorTime] = useState<string>('');
  const [visitorZone, setVisitorZone] = useState<string>('Local');

  const { ref: footerRef, isVisible } = useSectionReveal<HTMLElement>({
    threshold: 0.25,
    once: true,
    staggerInterval: 80,
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();

      // Studio Time in Asia/Kolkata (Ahmedabad, India)
      try {
        const istFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setStudioTime(istFormatter.format(now));
      } catch {
        setStudioTime(now.toTimeString().split(' ')[0]);
      }

      // Visitor Local Time
      try {
        const localFormatter = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setVisitorTime(localFormatter.format(now));

        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
        const friendlyTz = tz.split('/').pop()?.replace(/_/g, ' ') || 'Local';
        setVisitorZone(friendlyTz);
      } catch {
        setVisitorTime(now.toTimeString().split(' ')[0]);
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('launchlayer.dev@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer 
      ref={footerRef}
      data-reveal-section
      className={`py-10 sm:py-16 md:py-24 bg-transparent px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32 border-t border-black/[0.06] dark:border-white/[0.08] transition-colors duration-400 section-reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 mb-8 sm:mb-12 md:mb-16">
          <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-10">
            <motion.h2 
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-5xl md:text-6xl font-serif italic font-semibold text-[#0A0A0A] dark:text-[#F9F8F6] tracking-tight"
            >
              LaunchLayer.
            </motion.h2>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-black/70 dark:text-white/70 font-semibold">Get in Touch</span>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <Magnetic strength={0.2} className="self-start">
                  <a href="mailto:launchlayer.dev@gmail.com" className="text-base sm:text-2xl md:text-3xl font-serif italic font-semibold hover:opacity-60 transition-all premium-link self-start text-[#0A0A0A] dark:text-[#F9F8F6] break-all sm:break-normal">
                    launchlayer.dev@gmail.com
                  </a>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#161616] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-200 text-xs font-mono uppercase tracking-[0.16em] shadow-sm flex items-center gap-1.5 cursor-pointer text-[#0A0A0A] dark:text-[#F9F8F6] touch-manipulation font-medium"
                  >
                    {copied ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>Copied ✦</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>
            </div>

            {/* Live Dual World Time Clocks */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.03]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-mono text-black/60 dark:text-white/60 uppercase tracking-[0.18em]">
                  Studio IST:
                </span>
                <span className="text-xs font-mono font-medium tabular-nums tracking-wider text-black dark:text-white">
                  {studioTime || '15:30:00'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.03]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80"></span>
                <span className="text-[11px] font-mono text-black/60 dark:text-white/60 uppercase tracking-[0.18em]">
                  Your Time ({visitorZone}):
                </span>
                <span className="text-xs font-mono font-medium tabular-nums tracking-wider text-black dark:text-white">
                  {visitorTime || '02:30:00'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end gap-8 sm:gap-12">
            <div className="flex flex-col lg:items-end gap-3 sm:gap-5">
              <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-black/70 dark:text-white/70 font-semibold">Find Me Online</span>
              <div className="flex flex-wrap gap-4 sm:gap-8 md:gap-10 text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.22em] font-medium">
                 {['LinkedIn', 'Twitter', 'GitHub', 'Read.cv'].map((link) => (
                   <Magnetic key={link} strength={0.25}>
                     <a 
                       href="#" 
                       className="hover:text-black dark:hover:text-white hover:opacity-100 opacity-80 transition-all relative group text-black/75 dark:text-white/75 block py-1"
                     >
                        {link}
                        <div className="absolute -bottom-1 left-0 w-0 h-px bg-black dark:bg-white group-hover:w-full transition-all duration-300"></div>
                     </a>
                   </Magnetic>
                 ))}
              </div>
            </div>
            
            <div className="text-left lg:text-right space-y-2 sm:space-y-3">
               <span className="text-xs sm:text-[13px] font-mono text-black/70 dark:text-white/70 uppercase tracking-[0.2em] font-semibold">Ahmedabad, India · Working Worldwide</span>
               <p className="text-xs sm:text-base font-serif italic text-black/60 dark:text-white/60 max-w-xs lg:ml-auto leading-relaxed">
                 Designing and building fast, thoughtful websites for founders and creative businesses.
               </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-6 sm:pt-10 border-t border-black/10 dark:border-white/10 gap-4 sm:gap-6">
           <div className="flex items-center gap-2.5 sm:gap-3.5">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-black/50 dark:text-white/60">Independent Web Studio · 2025</span>
           </div>
           <Magnetic strength={0.3}>
             <button 
               onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
               className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-black/55 dark:text-white/65 hover:text-black dark:hover:text-white transition-colors group flex items-center gap-2 sm:gap-3 cursor-pointer py-1 px-2"
             >
               Back to top
               <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 15l7-7 7 7" />
               </svg>
             </button>
           </Magnetic>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
