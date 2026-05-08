import { Navbar } from './Navbar';

/**
 * Example usage of the Navbar component
 * 
 * This demonstrates the Navbar with:
 * - Fixed positioning at the top of the viewport
 * - Full width
 * - Glassmorphism styling (semi-transparent background with backdrop-filter blur)
 * - 4px solid #39FF14 (cyber lime) bottom border
 * 
 * The Navbar will remain visible during scroll and float above all content.
 */
export function NavbarExample() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Example content to demonstrate fixed positioning */}
      <div className="pt-24 px-6 space-y-8">
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold text-[#39FF14] neon-glow">
            TADS 1K CHALLENGE
          </h1>
        </section>
        
        <section className="h-screen flex items-center justify-center">
          <p className="text-xl text-[#39FF14]">
            Scroll to see the Navbar remain fixed at the top
          </p>
        </section>
        
        <section className="h-screen flex items-center justify-center">
          <p className="text-xl text-[#39FF14]">
            Notice the glassmorphism effect and cyber lime border
          </p>
        </section>
      </div>
    </div>
  );
}
