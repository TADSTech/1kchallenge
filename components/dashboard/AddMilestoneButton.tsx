'use client';

import { Plus } from 'lucide-react';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';

interface AddMilestoneButtonProps {
  onAdd: () => void;
}

export function AddMilestoneButton({ onAdd }: AddMilestoneButtonProps) {
  return (
    <div className="flex justify-center mb-8 relative z-10">
      <MagneticButton radius={50} maxShift={15} onClick={onAdd} aria-label="Add Milestone">
        <div className="border-4 border-[#39FF14] bg-black text-[#39FF14] uppercase tracking-widest font-bold glass transition-colors hover:bg-[#39FF14]/10 cursor-pointer">
          <GlitchText className="flex items-center gap-2 px-6 py-3">
            <Plus size={20} aria-hidden="true" />
            <span>Add Milestone</span>
          </GlitchText>
        </div>
      </MagneticButton>
    </div>
  );
}
