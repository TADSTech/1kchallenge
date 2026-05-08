import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MilestoneCard } from './MilestoneCard';
import { Milestone } from '@/lib/types';
import { COLORS } from '@/lib/constants';

describe('MilestoneCard', () => {
  const mockPendingMilestone: Milestone = {
    id: '1',
    title: 'First $100',
    targetDate: '2024-03-15',
    status: 'PENDING',
  };

  const mockVerifiedMilestone: Milestone = {
    id: '2',
    title: 'Reach $500',
    targetDate: '2024-04-01',
    status: 'VERIFIED',
  };

  it('renders the milestone title', () => {
    render(<MilestoneCard milestone={mockPendingMilestone} />);
    expect(screen.getByText('First $100')).toBeInTheDocument();
  });

  it('renders the target date with Calendar icon', () => {
    render(<MilestoneCard milestone={mockPendingMilestone} />);
    expect(screen.getByText(/Target:/)).toBeInTheDocument();
    expect(screen.getByText(/Mar 15, 2024/)).toBeInTheDocument();
  });

  it('renders PENDING status with Clock icon in alert orange', () => {
    render(<MilestoneCard milestone={mockPendingMilestone} />);
    const statusText = screen.getByText('PENDING');
    expect(statusText).toBeInTheDocument();
    expect(statusText).toHaveStyle({ color: COLORS.alertOrange });
  });

  it('renders VERIFIED status with CheckCircle icon in cyber lime', () => {
    render(<MilestoneCard milestone={mockVerifiedMilestone} />);
    const statusText = screen.getByText('VERIFIED');
    expect(statusText).toBeInTheDocument();
    expect(statusText).toHaveStyle({ color: COLORS.cyberLime });
  });

  it('applies glassmorphism styling with 4px solid border', () => {
    const { container } = render(<MilestoneCard milestone={mockPendingMilestone} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('glass');
    expect(card).toHaveClass('border-4');
    expect(card).toHaveClass('border-[#39FF14]');
  });

  it('displays title in uppercase', () => {
    render(<MilestoneCard milestone={mockPendingMilestone} />);
    const title = screen.getByText('First $100');
    expect(title).toHaveClass('uppercase');
  });

  it('uses monospaced font', () => {
    const { container } = render(<MilestoneCard milestone={mockPendingMilestone} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('font-mono');
  });
});
