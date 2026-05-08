import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '../Dashboard';
import { COLORS } from '@/lib/constants';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => (
      <div className={className} style={style} {...props}>{children}</div>
    ),
    h3: ({ children, className, ...props }: any) => (
      <h3 className={className} {...props}>{children}</h3>
    ),
    nav: ({ children, className, ...props }: any) => (
      <nav className={className} {...props}>{children}</nav>
    ),
    button: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>{children}</button>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Dashboard Component', () => {
  it('renders initial milestones', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Initialize Repository/i)).toBeInTheDocument();
  });

  it('adds a new milestone with PENDING status when "Add Milestone" is clicked', () => {
    render(<Dashboard />);
    
    const addButton = screen.getByLabelText(/Add Milestone/i);
    fireEvent.click(addButton);
    
    const newCards = screen.getAllByText(/NEW OBJECTIVE DETECTED/i);
    expect(newCards.length).toBeGreaterThan(0);
    
    const pendingBadges = screen.getAllByText(/PENDING/i);
    expect(pendingBadges.length).toBeGreaterThan(0);
  });

  it('displays correct colors for status badges', () => {
    render(<Dashboard />);
    
    // Check VERIFIED (initial mock milestone)
    const verifiedBadge = screen.getByText(/VERIFIED/i);
    expect(verifiedBadge).toHaveStyle({ color: COLORS.cyberLime });
    
    // Add new one (PENDING)
    const addButton = screen.getByLabelText(/Add Milestone/i);
    fireEvent.click(addButton);
    
    const pendingBadge = screen.getAllByText(/PENDING/i)[0];
    expect(pendingBadge).toHaveStyle({ color: COLORS.alertOrange });
  });
});
