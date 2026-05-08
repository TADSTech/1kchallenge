/**
 * Property-Based Tests for validation functions
 * Using fast-check for property-based testing with minimum 100 iterations
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateEmail, validateRequired, validateMimeType } from './validation';

describe('validation.ts - Property-Based Tests', () => {
  /**
   * Property 1: Valid email addresses are accepted, invalid ones are rejected
   * **Validates: Requirements 4.7**
   */
  describe('Property 1: Email validation', () => {
    it('should accept valid email formats (contains exactly one @, non-empty local part, non-empty domain with at least one dot)', () => {
      fc.assert(
        fc.property(
          // Generate valid email-shaped strings
          fc.tuple(
            fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789.-_'.split('')), { minLength: 1, maxLength: 20 }).map(arr => arr.join('')),
            fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), { minLength: 1, maxLength: 20 }).map(arr => arr.join('')),
            fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 2, maxLength: 10 }).map(arr => arr.join(''))
          ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`),
          (email) => {
            // All generated emails should be valid
            expect(validateEmail(email)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject strings without exactly one @ symbol', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => {
            const atCount = (s.match(/@/g) || []).length;
            return atCount !== 1;
          }),
          (invalidEmail) => {
            expect(validateEmail(invalidEmail)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject emails with empty local part', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), { minLength: 1, maxLength: 20 }).map(arr => arr.join('')),
            fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 2, maxLength: 10 }).map(arr => arr.join(''))
          ).map(([domain, tld]) => `@${domain}.${tld}`),
          (email) => {
            expect(validateEmail(email)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject emails with empty domain', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789.-_'.split('')), { minLength: 1, maxLength: 20 })
            .map(arr => arr.join(''))
            .map(local => `${local}@`),
          (email) => {
            expect(validateEmail(email)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject emails with domain missing a dot', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789.-_'.split('')), { minLength: 1, maxLength: 20 }).map(arr => arr.join('')),
            fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), { minLength: 1, maxLength: 20 }).map(arr => arr.join(''))
          ).map(([local, domain]) => `${local}@${domain}`),
          (email) => {
            expect(validateEmail(email)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: Empty and whitespace-only inputs are rejected
   * **Validates: Requirements 4.7**
   */
  describe('Property 2: Required field validation', () => {
    it('should reject strings composed entirely of whitespace characters', () => {
      fc.assert(
        fc.property(
          // Generate strings with only whitespace characters (spaces, tabs, newlines)
          fc.array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 50 }).map(arr => arr.join('')),
          (whitespaceString) => {
            expect(validateRequired(whitespaceString)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject empty strings', () => {
      expect(validateRequired('')).toBe(false);
    });

    it('should accept non-empty, non-whitespace strings', () => {
      fc.assert(
        fc.property(
          // Generate strings that contain at least one non-whitespace character
          fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          (validString) => {
            expect(validateRequired(validString)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Accepted MIME types are allowed, all others are rejected
   * **Validates: Requirements 6.7, 6.8**
   */
  describe('Property 3: MIME type validation', () => {
    const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

    it('should accept only image/png, image/jpeg, and image/webp', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...ACCEPTED_MIME_TYPES),
          (mimeType) => {
            expect(validateMimeType(mimeType)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject all other MIME type strings', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary strings that are NOT in the accepted list
          fc.string().filter(s => !ACCEPTED_MIME_TYPES.includes(s)),
          (invalidMimeType) => {
            expect(validateMimeType(invalidMimeType)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject common but unaccepted image MIME types', () => {
      const unacceptedImageTypes = [
        'image/gif',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
        'image/x-icon',
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...unacceptedImageTypes),
          (mimeType) => {
            expect(validateMimeType(mimeType)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
