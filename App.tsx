import React, { useState } from 'react';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Portfolio from './components/Portfolio';
import Perspective from './components/Perspective';
import Services from './components/Services';
import Metrics from './components/Metrics';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import ScrollToTop from './components/ScrollToTop';
import AmbientOrbs from './components/AmbientOrbs';
import GrainOverlay from './components/GrainOverlay';
import BackgroundVideo from './components/BackgroundVideo';
import { Project } from './types';
import { PROJECTS } from './constants';
import { useAutoSectionReveal } from './hooks/useSectionReveal';

const AppContent: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Initialize automatic viewport section detection with 30% visibility threshold
  useAutoSectionReveal('[data-reveal-section], .section-reveal', {
    threshold: 0.3,
    once: true,
    staggerInterval: 90,
  });

  return (
    <div className="min-h-screen relative text-[#0A0A0A] dark:text-[#F9F8F6] bg-[#F9F8F6] dark:bg-[#0A0A0A] overflow-x-clip transition-colors duration-400">
      <BackgroundVideo />
      <GrainOverlay />
      <AmbientOrbs />
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Portfolio onProjectClick={setSelectedProject} />
        <Services />
        <Perspective />
        <Metrics />
        <Contact />
      </main>

      <Footer />
      <ScrollToTop />

      <ProjectModal 
        project={selectedProject} 
        allProjects={PROJECTS}
        onClose={() => setSelectedProject(null)} 
        onSelectProject={setSelectedProject}
      />

      {/* Aesthetic High-Contrast Custom Cursor (Top Layer) */}
      <CustomCursor />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
