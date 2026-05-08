import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { EntryTerminal } from '../components/entry-terminal/EntryTerminal';
import { Dashboard } from '../components/dashboard/Dashboard';
import { EvidenceVault } from '../components/evidence-vault/EvidenceVault';
import { Navbar } from '../components/navbar/Navbar';
import { BrandHeader } from '../components/header/BrandHeader';

expect.extend(toHaveNoViolations);

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    nav: ({ children, className, ...props }: any) => <nav className={className} {...props}>{children}</nav>,
    h3: ({ children, className, ...props }: any) => <h3 className={className} {...props}>{children}</h3>,
    span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
    button: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
    header: ({ children, className, ...props }: any) => <header className={className} {...props}>{children}</header>,
    input: ({ children, className, ...props }: any) => <input className={className} {...props}>{children}</input>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock Auth
vi.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    authState: 'unauthenticated',
  }),
}));

describe('Accessibility Audit', () => {
  it('Navbar should have no accessibility violations', async () => {
    const { container } = render(<Navbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('BrandHeader should have no accessibility violations', async () => {
    const { container } = render(<BrandHeader />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('EntryTerminal should have no accessibility violations', async () => {
    const { container } = render(<EntryTerminal />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Dashboard should have no accessibility violations', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('EvidenceVault should have no accessibility violations', async () => {
    const { container } = render(<EvidenceVault />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
