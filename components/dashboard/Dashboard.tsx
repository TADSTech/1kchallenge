'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Milestone } from '@/lib/types';
import { AddMilestoneButton } from './AddMilestoneButton';
import { MilestoneCard } from './MilestoneCard';

const MOCK_INITIAL_MILESTONES: Milestone[] = [
  {
    id: '1',
    title: 'Initialize Repository',
    targetDate: new Date().toISOString(),
    status: 'VERIFIED',
  },
];

export function Dashboard() {
  const [milestones, setMilestones] = useState<Milestone[]>(MOCK_INITIAL_MILESTONES);

  const handleAddMilestone = () => {
    const newMilestone: Milestone = {
      id: uuidv4(),
      title: 'NEW OBJECTIVE DETECTED',
      targetDate: new Date().toISOString(),
      status: 'PENDING',
    };
    setMilestones((prev) => [newMilestone, ...prev]);
  };

  return (
    <section id="dashboard" className="w-full max-w-3xl mx-auto my-24 relative px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white neon-glow uppercase tracking-widest mb-4">
          Milestone Command Center
        </h2>
        <div className="h-1 w-24 bg-[#39FF14] mx-auto shadow-[0_0_10px_#39FF14]" />
      </div>

      <AddMilestoneButton onAdd={handleAddMilestone} />

      <div className="relative">
        {/* Industrial Pipe connecting cards */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0 border-l-4 border-[#39FF14] shadow-[0_0_10px_#39FF14] transform -translate-x-1/2 z-0 opacity-50" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="bg-black/80 rounded-lg">
              <MilestoneCard milestone={milestone} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
