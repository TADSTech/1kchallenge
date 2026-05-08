'use client';

import { motion } from 'framer-motion';

export function BrandHeader(): JSX.Element {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      }
    },
  };

  return (
    <motion.header 
      className="flex flex-col items-center justify-center min-h-[40vh] px-4 py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-4xl md:text-6xl font-bold font-mono text-cyberLime neon-glow text-center mb-8 tracking-tight"
        variants={itemVariants}
      >
        TADS 1K CHALLENGE
      </motion.h1>
      <motion.p 
        className="text-base md:text-lg font-mono text-cyberLime/80 text-center max-w-3xl mb-4"
        variants={itemVariants}
      >
        Industrialize your hustle. Three months. One thousand dollars. Zero excuses.
      </motion.p>
      <motion.div 
        className="text-sm font-mono text-alertOrange/80 border border-alertOrange/30 px-4 py-2 uppercase tracking-[0.2em]"
        variants={itemVariants}
      >
        MAY 11, 2026 — AUGUST 9, 2026
      </motion.div>
    </motion.header>
  );
}
