/**
 * Example usage of useMousePosition hook
 * This file demonstrates how to use the hook in a component
 * (Not part of the production code - for documentation purposes)
 */

import { useMousePosition } from './useMousePosition';

export function MousePositionExample() {
  const { x, y } = useMousePosition();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mouse Position Tracker</h2>
      <p>
        Current mouse position: X: {x}, Y: {y}
      </p>
    </div>
  );
}

/**
 * Example usage in AnimatedBackground component (as per design document):
 * 
 * export function AnimatedBackground() {
 *   const { x, y } = useMousePosition();
 *   
 *   // Use Framer Motion's useSpring for smooth interpolation
 *   const springX = useSpring(x, { stiffness: 100, damping: 30 });
 *   const springY = useSpring(y, { stiffness: 100, damping: 30 });
 *   
 *   return (
 *     <motion.div
 *       className="fixed inset-0 -z-10"
 *       style={{
 *         background: `radial-gradient(circle at ${springX}px ${springY}px, #39FF14 0%, #000000 50%)`,
 *       }}
 *     />
 *   );
 * }
 */
