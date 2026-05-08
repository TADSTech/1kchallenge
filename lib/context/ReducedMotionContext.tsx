'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

const ReducedMotionContext = createContext<boolean>(false);

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  
  // Cast to boolean to ensure a consistent value
  const reducedMotion = !!shouldReduceMotion;

  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export const useReducedMotionFlag = () => useContext(ReducedMotionContext);
