import React from 'react';

export const PortfolioParticleField: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 opacity-35 dark:opacity-25 ${className}`}
      aria-hidden="true"
    >
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default PortfolioParticleField;
