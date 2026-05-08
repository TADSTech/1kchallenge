import { MilestoneCard } from './MilestoneCard';
import { Milestone } from '@/lib/types';

export default function MilestoneCardExample() {
  const pendingMilestone: Milestone = {
    id: '1',
    title: 'First $100',
    targetDate: '2024-03-15',
    status: 'PENDING',
  };

  const verifiedMilestone: Milestone = {
    id: '2',
    title: 'Reach $500',
    targetDate: '2024-04-01',
    status: 'VERIFIED',
  };

  return (
    <div className="min-h-screen bg-black p-8 space-y-6">
      <h1 className="text-2xl font-mono text-[#39FF14] mb-8 neon-glow">
        MilestoneCard Examples
      </h1>

      <div className="space-y-6 max-w-md">
        <div>
          <h2 className="text-lg font-mono text-white mb-3">Pending Milestone</h2>
          <MilestoneCard milestone={pendingMilestone} />
        </div>

        <div>
          <h2 className="text-lg font-mono text-white mb-3">Verified Milestone</h2>
          <MilestoneCard milestone={verifiedMilestone} />
        </div>
      </div>
    </div>
  );
}
