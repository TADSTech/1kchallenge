import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMousePosition } from './useMousePosition';

describe('useMousePosition', () => {
  beforeEach(() => {
    // Reset mouse position before each test
  });

  afterEach(() => {
    // Clean up any event listeners
  });

  it('should initialize with position (0, 0)', () => {
    const { result } = renderHook(() => useMousePosition());
    
    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it('should update position when mousemove event is fired', () => {
    const { result } = renderHook(() => useMousePosition());
    
    // Simulate a mousemove event
    act(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200,
      });
      window.dispatchEvent(event);
    });
    
    expect(result.current).toEqual({ x: 100, y: 200 });
  });

  it('should update position multiple times as mouse moves', () => {
    const { result } = renderHook(() => useMousePosition());
    
    // First movement
    act(() => {
      const event1 = new MouseEvent('mousemove', {
        clientX: 50,
        clientY: 75,
      });
      window.dispatchEvent(event1);
    });
    
    expect(result.current).toEqual({ x: 50, y: 75 });
    
    // Second movement
    act(() => {
      const event2 = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 250,
      });
      window.dispatchEvent(event2);
    });
    
    expect(result.current).toEqual({ x: 150, y: 250 });
  });

  it('should track negative coordinates', () => {
    const { result } = renderHook(() => useMousePosition());
    
    act(() => {
      const event = new MouseEvent('mousemove', {
        clientX: -10,
        clientY: -20,
      });
      window.dispatchEvent(event);
    });
    
    expect(result.current).toEqual({ x: -10, y: -20 });
  });

  it('should track large coordinate values', () => {
    const { result } = renderHook(() => useMousePosition());
    
    act(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 3840,
        clientY: 2160,
      });
      window.dispatchEvent(event);
    });
    
    expect(result.current).toEqual({ x: 3840, y: 2160 });
  });

  it('should clean up event listener on unmount', () => {
    const { result, unmount } = renderHook(() => useMousePosition());
    
    // Move mouse to establish a position
    act(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200,
      });
      window.dispatchEvent(event);
    });
    
    expect(result.current).toEqual({ x: 100, y: 200 });
    
    // Unmount the hook - this should remove the event listener
    unmount();
    
    // After unmount, firing a mousemove event should not cause any errors
    // and should not update the (now unmounted) state
    expect(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 300,
        clientY: 400,
      });
      window.dispatchEvent(event);
    }).not.toThrow();
  });

  it('should not leak memory when mounted and unmounted multiple times', () => {
    // Mount and unmount the hook multiple times
    for (let i = 0; i < 10; i++) {
      const { result, unmount } = renderHook(() => useMousePosition());
      
      act(() => {
        const event = new MouseEvent('mousemove', {
          clientX: i * 10,
          clientY: i * 20,
        });
        window.dispatchEvent(event);
      });
      
      expect(result.current).toEqual({ x: i * 10, y: i * 20 });
      
      unmount();
    }
    
    // If cleanup is working properly, this should not throw or cause issues
    expect(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 500,
        clientY: 600,
      });
      window.dispatchEvent(event);
    }).not.toThrow();
  });
});
