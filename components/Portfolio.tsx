import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useReducedMotion } from 'motion/react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import Magnetic from './Magnetic';
import PortfolioParticleField from './PortfolioParticleField';
import { useSectionReveal } from '../hooks/useSectionReveal';

interface PortfolioProps {
  onProjectClick: (project: Project) => void;
}

const FALLBACK_MAP: Record<string, string> = {
  'Aura Beauty': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop',
  'Verve Studio': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
  'Nexus Flow': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
};

interface BlurUpThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  isMobileActive?: boolean;
}

const BlurUpThumbnail: React.FC<BlurUpThumbnailProps> = ({
  src,
  alt,
  className = '',
  isMobileActive = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // If src changes, update currentSrc
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
  }, [src]);

  // Guaranteed timeout so "Visualizing..." NEVER hangs forever
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);

    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [currentSrc]);

  const handleError = () => {
    const fallback = FALLBACK_MAP[alt] || FALLBACK_MAP['Aura Beauty'];
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden bg-black/[0.04] dark:bg-white/[0.04] ${className}`}>
      {/* Animated Shimmer Placeholder */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 overflow-hidden bg-[#EFECE6] dark:bg-[#1a1a1a] pointer-events-none"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-black/40 dark:text-white/40 font-medium">
                Loading...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Thumbnail with Solid Rendering to prevent mobile layer dropping */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0.85,
          transition: 'opacity 0.3s ease-out',
        }}
        className={`w-full h-full object-cover ${
          isMobileActive ? 'brightness-100 contrast-100' : 'brightness-95 dark:brightness-90'
        }`}
      />
    </div>
  );
};

interface ProjectRowProps {
  project: Project;
  idx: number;
  isLargeScreen: boolean;
  onProjectClick: (project: Project) => void;
  onMouseEnter: (project: Project) => void;
  onMouseLeave: () => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  idx,
  isLargeScreen,
  onProjectClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      tabIndex={0}
      role="button"
      aria-label={`Open case study for ${project.title}`}
      className="group relative border-b border-black/[0.08] dark:border-white/[0.08] py-8 sm:py-12 md:py-16 lg:py-20 flex flex-col md:flex-row items-baseline gap-4 sm:gap-8 md:gap-14 lg:gap-20 cursor-pointer transition-all duration-300 lg:hover:pl-6 hover:bg-black/[0.015] dark:hover:bg-white/[0.02] active:bg-black/[0.03] dark:active:bg-white/[0.04] rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      onMouseEnter={() => onMouseEnter(project)}
      onMouseLeave={onMouseLeave}
      onClick={() => onProjectClick(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onProjectClick(project);
        }
      }}
    >
      {/* Index */}
      <div className="min-w-[36px] sm:min-w-[48px] md:min-w-[64px] text-xs sm:text-sm font-mono tabular-nums pt-1 md:pt-3 opacity-50 dark:opacity-60 text-black dark:text-white group-hover:opacity-100 transition-opacity font-medium">
        0{idx + 1}.
      </div>

      {/* Title, Description, Tech Metadata & Mobile Preview */}
      <div className="flex-1 overflow-hidden w-full">
        <h3 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic font-normal sm:font-medium transition-transform duration-300 lg:group-hover:translate-x-6 text-balance text-[#0A0A0A] dark:text-[#F9F8F6] tracking-normal leading-snug cursor-pointer"
        >
          {project.title}
        </h3>

        {/* Short Editorial Subtitle on Mobile */}
        <p className="text-sm sm:text-base md:text-lg text-black/75 dark:text-white/75 font-normal mt-2 sm:mt-3 max-w-xl md:hidden leading-relaxed">
          {project.description}
        </p>

        {/* Mobile Tech Stack Metadata */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-3 lg:hidden text-xs font-mono text-black/65 dark:text-white/65">
          {project.techStack?.map((tech, tIdx) => (
            <React.Fragment key={tech}>
              {tIdx > 0 && <span className="opacity-30">·</span>}
              <span className="uppercase tracking-[0.14em]">{tech}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Mobile/Tablet Image Preview with Touch-Friendly Cue */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onProjectClick(project);
          }}
          className="mt-5 sm:mt-8 lg:hidden w-full aspect-[16/10] rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 shadow-[0_6px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-all duration-300 relative group/img cursor-pointer active:scale-[0.99]"
        >
          <BlurUpThumbnail
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full"
            isMobileActive={false}
          />
          <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-black/80 dark:bg-black/90 backdrop-blur-md text-white text-xs font-mono uppercase tracking-[0.16em] pointer-events-none flex items-center gap-1.5 shadow-md">
            <span>Explore Case Study</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/* Meta (Category & Direct Live Site Option at End) */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4 sm:gap-6 md:gap-8 lg:gap-10 md:self-center mt-4 sm:mt-5 md:mt-0">
        <div className="flex flex-col items-start md:items-end gap-1">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.18em] sm:tracking-[0.22em] text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition-colors whitespace-nowrap font-medium">
            {project.category}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-black/40 dark:text-white/40 hidden md:block">
            2025 · Production
          </span>
        </div>

        {/* Visual Cue for Opening Case Study Modal */}
        <div
          className="group/btn relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-black/15 dark:border-white/20 text-black dark:text-white bg-white/95 dark:bg-[#161616] group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-200 shrink-0 shadow-sm pointer-events-none"
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] font-medium hidden sm:inline">
            Case Study
          </span>
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

const CATEGORIES = ['All Works', 'E-Commerce', 'Architecture', 'Fintech & SaaS'];

const Portfolio: React.FC<PortfolioProps> = ({ onProjectClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Works');
  const [hovered, setHovered] = useState<Project | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const { ref: sectionRef, isVisible } = useSectionReveal<HTMLElement>({
    threshold: 0.2,
    once: true,
    staggerInterval: 80,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkScreen = () => {
      const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsLargeScreen(window.innerWidth >= 1024 && isFine);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen, { passive: true });

    let rafId: number | null = null;
    const handleMove = (e: MouseEvent) => {
      if (!isLargeScreen || rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', checkScreen);
      window.removeEventListener('mousemove', handleMove);
    };
  }, [mouseX, mouseY, isLargeScreen]);

  const filteredProjects = selectedCategory === 'All Works' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === 'All Works') return PROJECTS.length;
    return PROJECTS.filter(p => p.category === category).length;
  };

  const handleEnter = (p: Project) => {
    if (isLargeScreen) setHovered(p);
  };

  const handleLeave = () => {
    setHovered(null);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={sectionRef}
      id="work" 
      data-reveal-section
      className={`pt-8 sm:pt-14 md:pt-20 pb-10 sm:pb-16 md:pb-20 bg-transparent relative z-10 transition-colors duration-400 section-reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      {/* Ambient Micro-Dust Particle Field with Soft Gravitational Attraction */}
      <PortfolioParticleField />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32">
        
        {/* Section Header */}
        <header className="mb-6 sm:mb-12 md:mb-16">
          <div className="flex items-center gap-3 sm:gap-6 md:gap-8 mb-2.5 sm:mb-5 md:mb-7">
            <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-black/70 dark:text-white/70 font-semibold">
              Selected Work · Real Projects
            </span>
            <div className="h-px w-10 sm:w-16 md:w-20 bg-black/15 dark:bg-white/20"></div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif italic font-normal text-[#0A0A0A] dark:text-[#F9F8F6] tracking-normal leading-[1.08]">
              Selected <br />
              <span className="text-black/40 dark:text-white/45 not-italic font-syne font-extrabold uppercase tracking-tight block mt-0.5 sm:mt-1.5 text-2xl sm:text-4xl md:text-5xl">
                Stories.
              </span>
            </h2>

            {/* Interactive Category Filter Tabs with Horizontal Mobile Scrolling */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 w-full lg:w-auto">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = getCategoryCount(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-mono uppercase tracking-[0.16em] sm:tracking-[0.2em] transition-colors duration-200 outline-none cursor-pointer flex items-center gap-1.5 shrink-0 touch-manipulation font-medium ${
                      isActive 
                        ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm' 
                        : 'border border-black/10 dark:border-white/15 bg-white/50 dark:bg-white/[0.04] text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[9px] font-mono opacity-60 tabular-nums ${isActive ? 'text-white dark:text-black' : ''}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Project List */}
        <div className="flex flex-col border-t border-black/[0.08] dark:border-white/[0.08]">
          {filteredProjects.map((project, idx) => (
            <ProjectRow
              key={`${selectedCategory}-${project.id}`}
              project={project}
              idx={idx}
              isLargeScreen={isLargeScreen}
              onProjectClick={onProjectClick}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            />
          ))}
        </div>

        {/* Simplified Action Below Archive */}
        <div className="pt-8 sm:pt-12 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-black/[0.08] dark:border-white/[0.08]">
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
            All projects live and running for real businesses
          </span>

          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono text-xs sm:text-[13px] uppercase tracking-[0.16em] font-semibold hover:opacity-85 transition-opacity cursor-pointer shadow-xs"
          >
            <span>Start a Project</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Floating Preview Portal - Desktop Only */}
      <AnimatePresence>
        {hovered && isLargeScreen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed pointer-events-none z-50 overflow-hidden rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] bg-[#EFECE6] dark:bg-[#141414] border border-black/5 dark:border-white/10"
            style={{
              top: springY,
              left: springX,
              width: '340px',
              height: '440px',
              x: '-50%',
              y: '-50%',
            }}
          >
            <BlurUpThumbnail
              src={hovered.imageUrl}
              alt={hovered.title}
              className="w-full h-full"
              isMobileActive={true}
            />
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 flex flex-col gap-1 z-20 pointer-events-none">
               <span className="text-[9px] font-mono text-white/70 uppercase tracking-[0.3em] drop-shadow-sm font-medium">Project Preview</span>
               <span className="text-white text-sm font-serif italic drop-shadow-md">{hovered.title}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
