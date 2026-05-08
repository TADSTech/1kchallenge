import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Custom hook that tracks the cursor's X/Y coordinates via a mousemove event listener.
 * Returns the current mouse position as reactive state.
 * 
 * Used by AnimatedBackground to shift the background gradient in response to mouse movement.
 */
export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    // Add event listener to window
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove event listener on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return mousePosition;
}
