/**
 * Example usage of AnimatedBackground component
 * 
 * This example demonstrates how to use the AnimatedBackground component
 * in a Next.js page. The component should be placed at the root level
 * of your page to ensure it sits behind all other content.
 * 
 * The background grid reacts smoothly to mouse movement using Framer Motion's
 * useSpring for physics-based interpolation.
 */

import { AnimatedBackground } from './AnimatedBackground';

export default function ExamplePage() {
  return (
    <>
      {/* Background layer - renders behind all content */}
      {/* Move your mouse to see the grid shift in response */}
      <AnimatedBackground />
      
      {/* Your page content goes here */}
      <main className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#39FF14] mb-4">
            TADS 1K CHALLENGE
          </h1>
          <p className="text-white font-mono">
            Move your mouse to see the animated grid background react
          </p>
        </div>
      </main>
    </>
  );
}
