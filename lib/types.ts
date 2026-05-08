export interface Milestone {
  id: string;           // UUID, generated client-side
  title: string;        // Goal title
  targetDate: string;   // ISO date string (YYYY-MM-DD)
  status: 'PENDING' | 'VERIFIED';
}

export interface RegistrationFormValues {
  username: string;   // required, non-empty
  email: string;      // required, valid email format
}

export type VaultState = 'idle' | 'drag-over' | 'verifying' | 'success' | 'error';

export const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
export type AcceptedMimeType = typeof ACCEPTED_MIME_TYPES[number];

// Auth types
export type AuthState = 'unauthenticated' | 'authenticating' | 'authenticated';

export interface User {
  uid: string;
  email: string | null;
  username?: string;
}

export interface FirestoreUserData {
  username: string;
  email: string;
  createdAt: any; // Firestore timestamp
}
