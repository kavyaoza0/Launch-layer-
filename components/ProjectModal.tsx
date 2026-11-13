import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  allProjects?: Project[];
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
}

const FALLBACK_MAP: Record<string, string> = {
  'Aura Beauty': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop',
  'Verve Studio': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
  'Nexus Flow': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
};

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  allProjects = [],
  onClose,
  onSelectProject,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentIndex = allProjects.findIndex(p => p.id === project?.id);
  const nextProject = currentIndex >= 0 && allProjects.length > 1
    ? allProjects[(currentIndex + 1) % allProjects.length]
    : null;
  const prevProject = currentIndex >= 0 && allProjects.length > 1
    ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]
    : null;

  const handleNext = useCallback(() => {
    if (nextProject && onSelectProject) {
      onSelectProject(nextProject);
    }
  }, [nextProject, onSelectProject]);

  const handlePrev = useCallback(() => {
    if (prevProject && onSelectProject) {
      onSelectProject(prevProject);
    }
  }, [prevProject, onSelectProject]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose, handleNext, handlePrev]);

  if (!isMounted) return null;

  const modalTarget = document.getElementById('modal-root') || document.body;

  return createPortal(
    <AnimatePresence>
      {project && (
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto overscroll-contain flex min-h-screen sm:min-h-full items-start sm:items-center justify-center p-3 sm:p-6 md:p-8 py-6 sm:py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          {/* Frosted Glass Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/45 dark:bg-black/75 backdrop-blur-md cursor-pointer -z-10" 
            onClick={onClose} 
          />
          
          {/* Modal Dialog with Organic Spring Physics */}
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 28,
              mass: 0.85,
            }}
            className="relative z-10 w-full max-w-5xl xl:max-w-6xl my-auto bg-[#FAF9F6] dark:bg-[#111111] text-[#0A0A0A] dark:text-[#F9F8F6] border border-black/10 dark:border-white/15 overflow-hidden rounded-[1.5rem] sm:rounded-[2.25rem] md:rounded-[2.75rem] shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
          >
            {/* Sticky Nav Bar with Architectural Badges */}
            <div className="sticky top-0 z-30 flex justify-between items-center px-4 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-[#FAF9F6]/95 dark:bg-[#111111]/95 backdrop-blur-md border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] text-black/60 dark:text-white/60 font-medium">
                  Project · 0{project.id}
                </span>
                <div className="w-5 sm:w-8 md:w-12 h-px bg-black/10 dark:bg-white/15"></div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.35em] text-black/60 dark:text-white/60 font-medium hidden sm:inline">
                  {project.category}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Quick Prev / Next Buttons */}
                {allProjects.length > 1 && (
                  <div className="flex items-center gap-1.5 mr-1 sm:mr-3">
                    <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-black/[0.04] dark:bg-white/[0.06] text-black/45 dark:text-white/45 border border-black/[0.06] dark:border-white/[0.08] select-none mr-1">
                      [← / →]
                    </span>
                    <button
                      onClick={handlePrev}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center text-xs text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer touch-manipulation active:scale-95"
                      title="Previous project (←)"
                      aria-label="Previous project"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center text-xs text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer touch-manipulation active:scale-95"
                      title="Next project (→)"
                      aria-label="Next project"
                    >
                      →
                    </button>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-black/[0.04] dark:bg-white/[0.06] text-black/45 dark:text-white/45 border border-black/[0.06] dark:border-white/[0.08] select-none">
                    [ESC]
                  </span>
                  <button 
                    onClick={onClose} 
                    className="group flex items-center gap-2 sm:gap-4 md:gap-6 outline-none cursor-pointer py-1 px-1.5 touch-manipulation"
                    aria-label="Close modal"
                  >
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] sm:tracking-[0.35em] text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors hidden sm:inline font-medium">
                      Close
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-black/15 dark:border-white/20 bg-white dark:bg-[#181818] flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:border-black dark:group-hover:border-white group-hover:text-white dark:group-hover:text-black transition-all duration-200 shadow-sm active:scale-95">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12 lg:px-16 lg:py-14">
              {/* Header */}
              <header className="mb-6 sm:mb-10 md:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic font-normal mb-3 sm:mb-5 text-[#0A0A0A] dark:text-[#F9F8F6] tracking-normal">
                  {project.title}
                </h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                  {project.techStack?.map(tech => (
                    <span key={tech} className="px-3.5 py-1.5 bg-black/[0.03] dark:bg-white/[0.06] rounded-full text-xs font-mono uppercase tracking-[0.16em] text-black/80 dark:text-white/85 border border-black/10 dark:border-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </header>

              {/* Hero Photography Asset with Interactive Zoom & Specular Sheen */}
              <div className="group/img relative rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2rem] overflow-hidden mb-6 sm:mb-10 md:mb-14 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] aspect-[16/10] sm:aspect-video max-h-[460px] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                {/* Specular Ambient Edge Shimmer */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent z-10 pointer-events-none" />

                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = FALLBACK_MAP[project.title] || FALLBACK_MAP['Aura Beauty'];
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.03] ease-out will-change-transform" 
                />
              </div>

              {/* Detailed Editorial Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 md:gap-16 lg:gap-20 mb-10 sm:mb-16">
                <div className="lg:col-span-8">
                  <p className="text-base sm:text-xl md:text-2xl text-[#0A0A0A] dark:text-[#F9F8F6] mb-8 sm:mb-12 md:mb-16 font-serif italic font-normal leading-relaxed border-l-2 border-black/20 dark:border-white/20 pl-4 sm:pl-6 md:pl-8">
                    {project.longDescription}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 md:gap-12">
                    <div className="space-y-1.5 sm:space-y-3">
                      <h4 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-black/60 dark:text-white/65 font-medium">
                        The Challenge
                      </h4>
                      <p className="text-xs sm:text-sm md:text-base text-black/75 dark:text-white/75 font-light leading-relaxed">
                        {project.challenge}
                      </p>
                    </div>
                    <div className="space-y-1.5 sm:space-y-3">
                      <h4 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-black/60 dark:text-white/65 font-medium">
                        How We Solved It
                      </h4>
                      <p className="text-xs sm:text-sm md:text-base text-black/75 dark:text-white/75 font-light leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
                  <div className="p-5 sm:p-7 md:p-8 border border-black/[0.06] dark:border-white/10 rounded-[1.25rem] sm:rounded-[1.75rem] bg-white dark:bg-[#161616] shadow-[0_20px_60px_rgba(0,0,0,0.04)] dark:shadow-none space-y-5">
                    <div className="space-y-2 sm:space-y-3">
                      <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-black/55 dark:text-white/60 block font-medium">
                        Project Scope
                      </span>
                      <div className="space-y-1.5">
                        <div className="text-base sm:text-lg font-serif italic text-[#0A0A0A] dark:text-[#F9F8F6]">
                          {project.category}
                        </div>
                        <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed font-light">
                          Full custom design, responsive architecture & speed optimization.
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-black/65 dark:text-white/70 font-medium">
                        Status: Live in Production
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Single Dedicated Option to Visit Live Site at End of Case Study */}
              {project.link && (
              <div className="p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 rounded-[1.25rem] sm:rounded-[1.75rem] border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.24em] text-black/60 dark:text-white/60 font-medium">
                      Production Release Available
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-[#0A0A0A] dark:text-[#F9F8F6]">
                    Experience {project.title} live
                  </h4>
                  <p className="text-xs sm:text-sm text-black/70 dark:text-white/70 font-light">
                    Explore live interactions, dynamic motion, and production features in a new tab.
                  </p>
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs sm:text-sm font-mono uppercase tracking-[0.2em] font-medium hover:opacity-90 transition-all shadow-md active:scale-95 shrink-0"
                >
                  <span>Visit Live Website</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              )}

              {/* Next Project Peek Banner */}
              {nextProject && (
                <div className="pt-8 sm:pt-12 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/55 dark:text-white/60">
                      Next Case Study
                    </span>
                    <span className="text-xl sm:text-2xl font-serif italic text-black dark:text-white">
                      {nextProject.title}
                    </span>
                  </div>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-full border border-black/15 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all text-xs font-mono uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2 touch-manipulation active:scale-95"
                  >
                    <span>Explore Next</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalTarget
  );
};

export default ProjectModal;
