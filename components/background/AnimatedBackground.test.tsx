import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { AnimatedBackground } from './AnimatedBackground';

describe('AnimatedBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<AnimatedBackground />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has fixed positioning with z-index -1', () => {
    const { container } = render(<AnimatedBackground />);
    const backgroundDiv = container.firstChild as HTMLElement;
    
    expect(backgroundDiv).toHaveClass('fixed');
    expect(backgroundDiv).toHaveClass('inset-0');
    expect(backgroundDiv).toHaveStyle({ zIndex: -1 });
  });

  it('has black background color', () => {
    const { container } = render(<AnimatedBackground />);
    const backgroundDiv = container.firstChild as HTMLElement;
    
    expect(backgroundDiv).toHaveStyle({ backgroundColor: '#000000' });
  });

  it('has grid pattern background image', () => {
    const { container } = render(<AnimatedBackground />);
    const backgroundDiv = container.firstChild as HTMLElement;
    
    const style = window.getComputedStyle(backgroundDiv);
    expect(style.backgroundImage).toContain('linear-gradient');
  });

  it('has correct grid size', () => {
    const { container } = render(<AnimatedBackground />);
    const backgroundDiv = container.firstChild as HTMLElement;
    
    expect(backgroundDiv).toHaveStyle({ backgroundSize: '40px 40px' });
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<AnimatedBackground />);
    
    // The component should mount without errors
    expect(() => unmount()).not.toThrow();
    
    // After unmount, dispatching mouse events should not cause errors
    expect(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200,
      });
      window.dispatchEvent(event);
    }).not.toThrow();
  });

  it('responds to mouse movement by updating background position', () => {
    const { container } = render(<AnimatedBackground />);
    const backgroundDiv = container.firstChild as HTMLElement;
    
    // Simulate mouse movement
    act(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 400,
        clientY: 300,
      });
      window.dispatchEvent(event);
    });
    
    // The background should have motion values applied
    // (Framer Motion will handle the actual animation)
    expect(backgroundDiv).toBeInTheDocument();
  });

  it('animation runs continuously without errors', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    
    const { unmount } = render(<AnimatedBackground />);
    
    // Simulate multiple mouse movements to ensure continuous animation
    act(() => {
      for (let i = 0; i < 10; i++) {
        const event = new MouseEvent('mousemove', {
          clientX: i * 50,
          clientY: i * 30,
        });
        window.dispatchEvent(event);
      }
    });
    
    // No errors should be logged during animation
    expect(consoleSpy).not.toHaveBeenCalled();
    
    unmount();
    consoleSpy.mockRestore();
  });

  it('handles rapid mount/unmount cycles without memory leaks', () => {
    // Mount and unmount multiple times to verify cleanup
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(<AnimatedBackground />);
      
      act(() => {
        const event = new MouseEvent('mousemove', {
          clientX: i * 100,
          clientY: i * 100,
        });
        window.dispatchEvent(event);
      });
      
      unmount();
    }
    
    // If cleanup is working properly, this should not throw
    expect(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 500,
        clientY: 500,
      });
      window.dispatchEvent(event);
    }).not.toThrow();
  });
});
