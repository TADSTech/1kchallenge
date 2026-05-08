/**
 * Validation functions for TADS 1K Challenge
 * Pure functions for email, required field, and MIME type validation
 */

import { ACCEPTED_MIME_TYPES, type AcceptedMimeType } from './types';

/**
 * Validates email format
 * Returns true if the string contains exactly one @, a non-empty local part,
 * and a non-empty domain with at least one dot
 * 
 * @param s - The string to validate as an email
 * @returns true if valid email format, false otherwise
 */
export function validateEmail(s: string): boolean {
  // Check for exactly one @ symbol
  const atCount = (s.match(/@/g) || []).length;
  if (atCount !== 1) {
    return false;
  }

  const [localPart, domain] = s.split('@');

  // Check non-empty local part
  if (!localPart || localPart.length === 0) {
    return false;
  }

  // Check non-empty domain with at least one dot
  if (!domain || domain.length === 0) {
    return false;
  }

  // Check domain has at least one dot
  if (!domain.includes('.')) {
    return false;
  }

  // Check that domain doesn't start or end with a dot
  if (domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }

  // Check that there's content after the last dot (TLD)
  const lastDotIndex = domain.lastIndexOf('.');
  if (lastDotIndex === domain.length - 1) {
    return false;
  }

  return true;
}

/**
 * Validates that a string is not empty or whitespace-only
 * Returns false for strings composed entirely of whitespace characters
 * 
 * @param s - The string to validate
 * @returns true if non-empty and contains non-whitespace, false otherwise
 */
export function validateRequired(s: string): boolean {
  // Reject empty strings
  if (s.length === 0) {
    return false;
  }

  // Reject whitespace-only strings
  if (s.trim().length === 0) {
    return false;
  }

  return true;
}

/**
 * Validates that a MIME type is one of the accepted image formats
 * Accepted types: image/png, image/jpeg, image/webp
 * 
 * @param s - The MIME type string to validate
 * @returns true if the MIME type is accepted, false otherwise
 */
export function validateMimeType(s: string): boolean {
  return ACCEPTED_MIME_TYPES.includes(s as AcceptedMimeType);
}
