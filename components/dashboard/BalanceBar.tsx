'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock } from 'lucide-react';
import { COLORS } from '@/lib/constants';

interface BalanceBarProps {
  current: number;
  target: number;
  isPending?: boolean;
}

export function BalanceBar({ current, target, isPending = false }: BalanceBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const themeColor = isPending ? COLORS.alertOrange : COLORS.cyberLime;


  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-16 font-mono">
      <div className="flex justify-between items-end mb-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] block" style={{ color: `${themeColor}80` }}>
            {isPending ? 'AUDIT_IN_PROGRESS' : 'CAPITAL_ACCUMULATION'}
          </span>
          <div className="flex items-center gap-3">
            {isPending ? (
              <Clock size={24} style={{ color: themeColor }} className="animate-pulse" />
            ) : (
              <TrendingUp size={24} style={{ color: themeColor }} />
            )}
            <span className="text-3xl font-bold text-white tracking-tighter">
              ${current.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="text-right space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] block" style={{ color: `${themeColor}80` }}>
            PHASE_OBJECTIVE
          </span>
          <div className="flex items-center justify-end gap-2">
            <span className="text-xl font-bold text-white/80">${target.toLocaleString()}</span>
            <Target size={18} style={{ color: `${themeColor}60` }} />
          </div>
        </div>
      </div>

      <div className="relative h-4 bg-white/5 border rounded-full overflow-hidden backdrop-blur-sm transition-colors duration-500" style={{ borderColor: `${themeColor}33` }}>
        {/* Grid lines in background */}
        <div className="absolute inset-0 flex justify-between px-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-px h-full" style={{ backgroundColor: `${themeColor}1a` }} />
          ))}
        </div>
        
        {/* Animated Progress Fill */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 transition-colors duration-500"
          style={{ 
            background: `linear-gradient(to right, ${themeColor}66, ${themeColor})`,
            boxShadow: `0 0 15px ${themeColor}`
          }}
        >
          {/* Scanning light effect */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
          />
        </motion.div>
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-[9px] uppercase tracking-widest" style={{ color: `${themeColor}66` }}>
          {isPending ? 'VERIFICATION_PROTOCOL_ACTIVE' : 'PROTOCOL_ESTABLISHED'}
        </span>
        <span className="text-[9px] uppercase tracking-widest" style={{ color: `${themeColor}66` }}>
          {percentage.toFixed(1)}% {isPending ? 'Projected' : 'Complete'}
        </span>
      </div>
    </div>
  );
}
