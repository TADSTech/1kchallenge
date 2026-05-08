'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  duration: number;
  onComplete?: () => void;
}

export function ProgressBar({ duration, onComplete }: ProgressBarProps) {
  return (
    <div className="w-full h-4 bg-black border-2 border-[#39FF14] relative overflow-hidden rounded">
      <motion.div
        className="h-full bg-[#39FF14] shadow-[0_0_10px_#39FF14]"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration, ease: 'linear' }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
}
