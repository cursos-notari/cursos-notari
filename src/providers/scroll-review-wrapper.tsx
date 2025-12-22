'use client'

import { useEffect, ReactNode, useState } from 'react';
import { initScrollReveal } from '@/lib/init-scroll-reveal';

interface ScrollRevealWrapperProps {
  children: ReactNode;
}

export function ScrollRevealWrapper({ children }: ScrollRevealWrapperProps) {
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { 
    const initReveal = async () => {
      await initScrollReveal();
      setIsLoaded(true);
    };
    initReveal();
  }, []);

  return (
    <div
      style={{ 
        opacity: isLoaded ? 1 : 0, 
        transition: 'opacity 0.3s ease' 
      }}
    >
      {children}
    </div>
  );
}