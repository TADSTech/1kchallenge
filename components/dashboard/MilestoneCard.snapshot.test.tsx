import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MilestoneCard } from './MilestoneCard';
import { Milestone } from '@/lib/types';

describe('MilestoneCard Snapshots', () => {
  it('matches snapshot for PENDING milestone', () => {
    const pendingMilestone: Milestone = {
      id: '1',
      title: 'First $100',
      targetDate: '2024-03-15',
      status: 'PENDING',
    };

    const { container } = render(<MilestoneCard milestone={pendingMilestone} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for VERIFIED milestone', () => {
    const verifiedMilestone: Milestone = {
      id: '2',
      title: 'Reach $500',
      targetDate: '2024-04-01',
      status: 'VERIFIED',
    };

    const { container } = render(<MilestoneCard milestone={verifiedMilestone} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
