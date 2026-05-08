import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandHeader } from './BrandHeader';

describe('BrandHeader', () => {
  it('renders the title "TADS 1K CHALLENGE"', () => {
    render(<BrandHeader />);
    expect(screen.getByText('TADS 1K CHALLENGE')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<BrandHeader />);
    expect(
      screen.getByText('Industrialize your hustle. Three months. One thousand dollars. Zero excuses.')
    ).toBeInTheDocument();
  });

  it('applies neon-glow class to the title', () => {
    render(<BrandHeader />);
    const title = screen.getByText('TADS 1K CHALLENGE');
    expect(title).toHaveClass('neon-glow');
  });

  it('applies cyberLime color to the title', () => {
    render(<BrandHeader />);
    const title = screen.getByText('TADS 1K CHALLENGE');
    expect(title).toHaveClass('text-cyberLime');
  });

  it('renders title in monospaced font', () => {
    render(<BrandHeader />);
    const title = screen.getByText('TADS 1K CHALLENGE');
    expect(title).toHaveClass('font-mono');
  });

  it('renders title in bold', () => {
    render(<BrandHeader />);
    const title = screen.getByText('TADS 1K CHALLENGE');
    expect(title).toHaveClass('font-bold');
  });

  it('renders tagline beneath the title', () => {
    const { container } = render(<BrandHeader />);
    const title = screen.getByText('TADS 1K CHALLENGE');
    const tagline = screen.getByText(/Industrialize your hustle/);
    
    // Check that tagline comes after title in DOM order
    const header = container.querySelector('header');
    const children = Array.from(header?.children || []);
    const titleIndex = children.indexOf(title.closest('h1')!);
    const taglineIndex = children.indexOf(tagline.closest('p')!);
    
    expect(taglineIndex).toBeGreaterThan(titleIndex);
  });
});
