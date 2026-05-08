import { BrandHeader } from './BrandHeader';

/**
 * Example usage of the BrandHeader component
 * 
 * This component renders the TADS 1K Challenge brand header with:
 * - Title "TADS 1K CHALLENGE" in all-caps with neon green glow effect
 * - Tagline beneath the title
 * - Monospaced typography (JetBrains Mono)
 * - Responsive text sizing
 */
export default function BrandHeaderExample() {
  return (
    <div className="min-h-screen bg-voidBlack">
      <BrandHeader />
    </div>
  );
}
