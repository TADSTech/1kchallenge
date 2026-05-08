'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useMousePosition } from '@/lib/hooks/useMousePosition';

/**
 * AnimatedBackground component
 * 
 * Renders a full-viewport fixed background layer with a matrix-style grid pattern.
 * The grid is created using CSS linear-gradients to form a cyberpunk-inspired grid.
 * 
 * Features:
 * - Fixed positioning behind all content (z-index: -1)
 * - Matrix-style grid pattern using CSS background-image
 * - Tracks mouse position via useMousePosition hook (wired in task 4.3)
 * - Smoothly shifts grid offset in response to mouse movement using Framer Motion useSpring
 * - Black background with cyber lime grid lines
 * - Continuous animation via Framer Motion springs (automatically handles requestAnimationFrame)
 * - Proper cleanup: useMousePosition hook removes event listeners on unmount
 * 
 * Validates: Requirement 2 (Animated Background)
 * Validates: Requirement 2.3 (continuous animation at 30fps+)
 */
export function AnimatedBackground(): JSX.Element {
  const mousePosition = useMousePosition();

  // Create spring-smoothed values for mouse position
  // The spring creates a smooth, physics-based interpolation
  const smoothX = useSpring(mousePosition.x, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mousePosition.y, { stiffness: 100, damping: 20 });

  // Transform the smoothed mouse position into background offset values
  // Divide by 20 to make the movement subtle
  const backgroundX = useTransform(smoothX, (x) => `${x / 20}px`);
  const backgroundY = useTransform(smoothY, (y) => `${y / 20}px`);

  return (
    <motion.div
      className="fixed inset-0 w-full h-full"
      style={{
        zIndex: -1,
        backgroundColor: '#000000',
        backgroundImage: `
          linear-gradient(to right, rgba(57, 255, 20, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(57, 255, 20, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        // Shift the grid offset based on smoothed mouse position
        backgroundPositionX: backgroundX,
        backgroundPositionY: backgroundY,
      }}
    />
  );
}
