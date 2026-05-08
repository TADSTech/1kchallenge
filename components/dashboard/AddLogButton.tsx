'use client';

import { motion } from 'framer-motion';
import { Plus, Terminal } from 'lucide-react';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';

interface AddLogButtonProps {
  onAdd: () => void;
  isDisabled?: boolean;
}

export function AddLogButton({ onAdd, isDisabled }: AddLogButtonProps) {
  return (
    <div className="flex justify-center mb-16 relative z-10">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-cyberLime/30" />
      
      <MagneticButton 
        radius={50} 
        maxShift={15} 
        onClick={isDisabled ? undefined : onAdd} 
        aria-label="Add Audit Log"
        disabled={isDisabled}
      >
        <motion.div 
          className={`
            relative
            group
            bg-voidBlack 
            border-2 
            ${isDisabled ? 'border-cyberLime/20 text-cyberLime/20 cursor-not-allowed' : 'border-cyberLime text-cyberLime cursor-pointer shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]'}
            font-mono 
            font-bold 
            px-8 
            py-4
            flex
            items-center
            gap-3
            overflow-hidden
            transition-all
            duration-300
          `}
          whileHover={isDisabled ? {} : { scale: 1.05 }}
          whileTap={isDisabled ? {} : { scale: 0.95 }}
        >
          {/* Animated background scanline */}
          {!isDisabled && <div className="absolute inset-0 bg-cyberLime/5 -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out" />}
          
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10 tracking-widest uppercase text-sm">
            <GlitchText>{isDisabled ? 'CHALLENGE_LOCKED' : 'Initialize Audit Log'}</GlitchText>
          </span>
          <Terminal size={18} className="relative z-10 opacity-50" />
        </motion.div>
      </MagneticButton>
    </div>
  );
}

