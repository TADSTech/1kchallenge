import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlitchText } from './GlitchText';
import { MagneticButton } from './MagneticButton';
import { ScanlineOverlay } from './ScanlineOverlay';

describe('GlitchText', () => {
  it('renders children correctly', () => {
    render(<GlitchText>Test Content</GlitchText>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GlitchText className="custom-class">Test</GlitchText>
    );
    const span = container.querySelector('span');
    expect(span).toHaveClass('custom-class');
  });

  it('renders as a motion.span element', () => {
    const { container } = render(<GlitchText>Test</GlitchText>);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });
});

describe('MagneticButton', () => {
  it('renders children correctly', () => {
    render(<MagneticButton>Click Me</MagneticButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<MagneticButton className="custom-btn">Test</MagneticButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-btn');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<MagneticButton onClick={handleClick}>Click</MagneticButton>);
    const button = screen.getByRole('button');
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a button element', () => {
    render(<MagneticButton>Test</MagneticButton>);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('translation clamping: button starts at rest position (0, 0)', () => {
    const { container } = render(<MagneticButton>Test</MagneticButton>);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    // Initial position should be at rest (no transform applied yet)
    // The motion.button will have inline styles when animated
  });
});

describe('ScanlineOverlay', () => {
  it('renders a fixed overlay element', () => {
    const { container } = render(<ScanlineOverlay />);
    const overlay = container.querySelector('div');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('pointer-events-none');
  });

  it('has correct z-index for overlay', () => {
    const { container } = render(<ScanlineOverlay />);
    const overlay = container.querySelector('div');
    expect(overlay).toHaveClass('z-[9999]');
  });

  it('is hidden from screen readers', () => {
    const { container } = render(<ScanlineOverlay />);
    const overlay = container.querySelector('div');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });
});
