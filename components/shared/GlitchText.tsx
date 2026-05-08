'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import { useReducedMotionFlag } from '@/lib/context/ReducedMotionContext';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
}

export function GlitchText({ children, className = '' }: GlitchTextProps) {
  const shouldReduceMotion = useReducedMotionFlag();

  return (
    <motion.span
      className={className}
      whileHover={shouldReduceMotion ? { opacity: 0.7 } : {
        x: [0, -2, 2, -1, 1, 0],
        opacity: [1, 0.8, 1, 0.9, 1],
      }}
      transition={{
        duration: 0.3,
        times: shouldReduceMotion ? undefined : [0, 0.2, 0.4, 0.6, 0.8, 1],
      }}
    >
      {children}
    </motion.span>
  );
}
