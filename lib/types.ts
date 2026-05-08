export interface AccountLog {
  id: string;           // UUID, generated client-side
  source: string;       // Where did you get the money from?
  description: string;  // Details about the transaction
  amount: number;       // Amount earned
  balanceImageUrl: string; // Screenshot of current bank balance
  timestamp: string;    // ISO date string
  status: 'PENDING' | 'VERIFIED';
}

export interface RegistrationFormValues {
  username: string;   // required, non-empty
  email: string;      // required, valid email format
  password: string;   // required, min 6 chars
}

export interface LoginFormValues {
  identifier: string; // email or username
  password: string;
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
  createdAt: unknown; // Firestore timestamp
}
