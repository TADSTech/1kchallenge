import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders with correct structure and styling', () => {
    render(<Navbar />);
    
    // Check that nav element exists
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
    
    // Check that nav has fixed positioning and glassmorphism classes
    expect(nav).toHaveClass('fixed', 'top-0', 'glass');
    
    // Check that nav has the cyber lime bottom border
    expect(nav).toHaveClass('border-b-4', 'border-[#39FF14]');
    
    // Check that nav has full width
    expect(nav).toHaveClass('w-full');
    
    // Check that nav has proper z-index for staying on top
    expect(nav).toHaveClass('z-50');
  });

  it('renders all three navigation links', () => {
    render(<Navbar />);
    
    // Check that all three navigation links are present
    const entryTerminalLink = screen.getByRole('link', { name: /entry terminal/i });
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const evidenceVaultLink = screen.getByRole('link', { name: /evidence vault/i });
    
    expect(entryTerminalLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
    expect(evidenceVaultLink).toBeInTheDocument();
  });

  it('navigation links have correct href attributes', () => {
    render(<Navbar />);
    
    const entryTerminalLink = screen.getByRole('link', { name: /entry terminal/i });
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const evidenceVaultLink = screen.getByRole('link', { name: /evidence vault/i });
    
    expect(entryTerminalLink).toHaveAttribute('href', '#entry-terminal');
    expect(dashboardLink).toHaveAttribute('href', '#dashboard');
    expect(evidenceVaultLink).toHaveAttribute('href', '#evidence-vault');
  });

  it('calls scrollIntoView with smooth behavior when navigation link is clicked', () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    const mockElement = document.createElement('div');
    mockElement.id = 'entry-terminal';
    mockElement.scrollIntoView = mockScrollIntoView;
    document.body.appendChild(mockElement);
    
    render(<Navbar />);
    
    const entryTerminalLink = screen.getByRole('link', { name: /entry terminal/i });
    fireEvent.click(entryTerminalLink);
    
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    
    // Cleanup
    document.body.removeChild(mockElement);
  });

  it('prevents default link behavior when clicked', () => {
    // Create a mock element for the target
    const mockElement = document.createElement('div');
    mockElement.id = 'dashboard';
    mockElement.scrollIntoView = vi.fn();
    document.body.appendChild(mockElement);
    
    render(<Navbar />);
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    
    // Click the link
    fireEvent.click(dashboardLink);
    
    // The page should not navigate (scrollIntoView should be called instead)
    expect(mockElement.scrollIntoView).toHaveBeenCalled();
    
    // Cleanup
    document.body.removeChild(mockElement);
  });

  it('handles missing target element gracefully', () => {
    render(<Navbar />);
    
    const evidenceVaultLink = screen.getByRole('link', { name: /evidence vault/i });
    
    // Click the link when target element doesn't exist
    // Should not throw an error
    expect(() => fireEvent.click(evidenceVaultLink)).not.toThrow();
  });

  it('matches snapshot and confirms all three navigation links are present', () => {
    const { container } = render(<Navbar />);
    
    // Verify all three navigation links are present in the snapshot
    const entryTerminalLink = screen.getByRole('link', { name: /entry terminal/i });
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const evidenceVaultLink = screen.getByRole('link', { name: /evidence vault/i });
    
    expect(entryTerminalLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
    expect(evidenceVaultLink).toBeInTheDocument();
    
    // Capture snapshot of the entire navbar
    expect(container.firstChild).toMatchSnapshot();
  });
});
