'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { entranceVariants } from '@/lib/animations';
import { AnimatedBackground } from '@/components/background/AnimatedBackground';
import { ScanlineOverlay } from '@/components/shared/ScanlineOverlay';
import { useAuth } from '@/lib/hooks/useAuth';
import { BrandHeader } from '@/components/header/BrandHeader';
import { EntryTerminal } from '@/components/entry-terminal/EntryTerminal';
import { Dashboard } from '@/components/dashboard/Dashboard';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* Background layer - fixed behind all content */}
      <AnimatedBackground />
      
      {/* Scanline overlay - fixed on top of all content */}
      <ScanlineOverlay />
      
      {/* Main content sections */}
      <main className={`relative min-h-screen flex flex-col items-center ${user ? 'pt-20' : 'justify-center'}`}>
        {/* Frame Glow Effect for Challenge Phase */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[50] shadow-[inset_0_0_60px_rgba(57,255,20,0.1)] md:shadow-[inset_0_0_100px_rgba(57,255,20,0.15)]"
            aria-hidden="true"
          />
        )}

        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="w-full flex flex-col items-center"
          >
            {/* Brand Header */}
            <motion.div variants={entranceVariants} className="w-full flex justify-center">
              <BrandHeader />
            </motion.div>

            {/* Quick Access Utility Bar */}
            <motion.div 
              variants={entranceVariants} 
              className="w-full max-w-xl mx-auto px-6 mb-8 text-center relative z-20"
            >
              <Link 
                href="/agenda"
                className="inline-flex items-center gap-2 px-6 py-3 border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 rounded-full font-mono text-xs text-pink-400 uppercase tracking-widest transition-all duration-300 hover:border-blue-400/40 hover:scale-105 shadow-md shadow-pink-500/5"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                Launch Agenda Builder
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              </Link>
            </motion.div>
            
            {/* Entry Terminal (Registration) */}
            <motion.div variants={entranceVariants} className="w-full">
              <EntryTerminal />
            </motion.div>

            {/* Authenticated content */}
            {user && (
              <motion.div variants={entranceVariants} className="w-full">
                <Dashboard />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
