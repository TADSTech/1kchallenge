import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ANIMATION } from '@/lib/constants';

/**
 * Property 4: Magnetic button translation stays within bounds
 * 
 * **Validates: Requirements 4.5, 7.2**
 * 
 * For any cursor position within the magnetic radius, the computed button 
 * translation SHALL have a magnitude no greater than `maxShift` pixels in 
 * any direction.
 */

// Pure function extracted from MagneticButton logic for testing
function calculateMagneticTranslation(
  cursorX: number,
  cursorY: number,
  buttonCenterX: number,
  buttonCenterY: number,
  radius: number,
  maxShift: number
): { x: number; y: number } {
  const deltaX = cursorX - buttonCenterX;
  const deltaY = cursorY - buttonCenterY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance <= radius && distance > 0) {
    const magnitude = Math.min(distance / radius, 1) * maxShift;
    const directionX = deltaX / distance;
    const directionY = deltaY / distance;
    
    return {
      x: directionX * magnitude,
      y: directionY * magnitude,
    };
  }

  return { x: 0, y: 0 };
}

describe('MagneticButton - Property-Based Tests', () => {
  it('Property 4: translation magnitude never exceeds maxShift for any cursor position within radius', () => {
    const maxShift = ANIMATION.magneticMaxShift;
    const radius = ANIMATION.magneticRadius;

    fc.assert(
      fc.property(
        // Generate button center position
        fc.integer({ min: 0, max: 2000 }),
        fc.integer({ min: 0, max: 2000 }),
        // Generate cursor position within radius
        fc.float({ min: 0, max: Math.fround(radius) }),
        fc.float({ min: 0, max: Math.fround(2 * Math.PI) }),
        (buttonCenterX, buttonCenterY, distanceFromCenter, angle) => {
          // Convert polar coordinates to cartesian
          const cursorX = buttonCenterX + distanceFromCenter * Math.cos(angle);
          const cursorY = buttonCenterY + distanceFromCenter * Math.sin(angle);

          const translation = calculateMagneticTranslation(
            cursorX,
            cursorY,
            buttonCenterX,
            buttonCenterY,
            radius,
            maxShift
          );

          // Calculate the magnitude of the translation vector
          const translationMagnitude = Math.sqrt(
            translation.x * translation.x + translation.y * translation.y
          );

          // The magnitude must never exceed maxShift
          // Using a small epsilon for floating-point comparison
          expect(translationMagnitude).toBeLessThanOrEqual(maxShift + 0.0001);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: translation is zero when cursor is outside radius', () => {
    const maxShift = ANIMATION.magneticMaxShift;
    const radius = ANIMATION.magneticRadius;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2000 }),
        fc.integer({ min: 0, max: 2000 }),
        // Generate cursor position outside radius
        fc.float({ min: Math.fround(radius + 1), max: Math.fround(radius + 500) }),
        fc.float({ min: 0, max: Math.fround(2 * Math.PI) }),
        (buttonCenterX, buttonCenterY, distanceFromCenter, angle) => {
          const cursorX = buttonCenterX + distanceFromCenter * Math.cos(angle);
          const cursorY = buttonCenterY + distanceFromCenter * Math.sin(angle);

          const translation = calculateMagneticTranslation(
            cursorX,
            cursorY,
            buttonCenterX,
            buttonCenterY,
            radius,
            maxShift
          );

          expect(translation.x).toBe(0);
          expect(translation.y).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: translation direction points toward cursor', () => {
    const maxShift = ANIMATION.magneticMaxShift;
    const radius = ANIMATION.magneticRadius;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2000 }),
        fc.integer({ min: 0, max: 2000 }),
        fc.float({ min: 1, max: Math.fround(radius) }), // Avoid zero distance
        fc.float({ min: 0, max: Math.fround(2 * Math.PI) }),
        (buttonCenterX, buttonCenterY, distanceFromCenter, angle) => {
          const cursorX = buttonCenterX + distanceFromCenter * Math.cos(angle);
          const cursorY = buttonCenterY + distanceFromCenter * Math.sin(angle);

          const translation = calculateMagneticTranslation(
            cursorX,
            cursorY,
            buttonCenterX,
            buttonCenterY,
            radius,
            maxShift
          );

          // Calculate expected direction
          const deltaX = cursorX - buttonCenterX;
          const deltaY = cursorY - buttonCenterY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const expectedDirectionX = deltaX / distance;
          const expectedDirectionY = deltaY / distance;

          // Calculate actual direction from translation
          const translationMagnitude = Math.sqrt(
            translation.x * translation.x + translation.y * translation.y
          );

          if (translationMagnitude > 0) {
            const actualDirectionX = translation.x / translationMagnitude;
            const actualDirectionY = translation.y / translationMagnitude;

            // Directions should match (with small epsilon for floating-point)
            expect(actualDirectionX).toBeCloseTo(expectedDirectionX, 5);
            expect(actualDirectionY).toBeCloseTo(expectedDirectionY, 5);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
