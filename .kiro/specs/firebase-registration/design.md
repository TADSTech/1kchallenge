# Design Document

## Overview

The TADS 1K Challenge currently has a client-side-only registration form that shows a success message locally but doesn't persist data anywhere. This design adds Firebase integration to provide real backend persistence for user registration data.

The implementation will use Firebase Authentication for user registration and Firebase Firestore for storing user data. The system will manage authentication state across the app, show loading states during registration, and handle errors gracefully. The design follows the existing "Cyber-Industrial Maximalism" aesthetic with Cyber Lime (`#39FF14`) and Alert Orange (`#FF5F1F`) color scheme.

**Key technology choices:**
- **Firebase Authentication** — user registration and authentication
- **Firebase Firestore** — NoSQL document database for user data
- **Next.js 14 (App Router)** — framework with server-side API routes
- **TypeScript** — type safety throughout
- **React Context API** — authentication state management
- **Custom hooks** — reusable authentication logic

---

## Architecture

The application will be extended with Firebase integration. The architecture follows a layered approach with clear separation of concerns:

```
app/
  page.tsx                  ← Root page (no changes needed)
  layout.tsx                ← Root layout: Firebase provider wrapper
  globals.css               ← No changes needed

components/
  entry-terminal/
    EntryTerminal.tsx       ← Modified: Connect to Firebase auth
    FirebaseRegistrationForm.tsx ← New: Firebase-aware form component

lib/
  firebase.ts               ← New: Firebase configuration and initialization
  hooks/
    useAuth.ts              ← New: Custom hook for authentication state
    useFirebaseAuth.ts      ← New: Custom hook for Firebase auth operations
  types.ts                  ← Extended: Auth-related types
```

### Data Flow

```
EntryTerminal (UI Layer)
  ↓
FirebaseRegistrationForm (Form Layer)
  ↓
useFirebaseAuth hook (Business Logic)
  ↓
Firebase SDK (Authentication & Firestore)
  ↓
Firebase Backend Services
```

### Component Hierarchy

```
EntryTerminal
  └── FirebaseRegistrationForm (new)
        ├── TerminalInput (username)
        ├── TerminalInput (email)
        └── MagneticButton (submit)
```

---

## Components and Interfaces

### `lib/firebase.ts`

Firebase configuration and initialization. Uses Next.js environment variables for sensitive configuration.

```typescript
// lib/firebase.ts

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration (from environment variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;
let firebaseFirestore: Firestore;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

firebaseAuth = getAuth(firebaseApp);
firebaseFirestore = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firebaseFirestore };
```

### `lib/hooks/useAuth.ts`

Custom hook for authentication state management using React Context.

```typescript
// lib/hooks/useAuth.ts

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { firebaseAuth } from '../firebase';

export type AuthState = 'unauthenticated' | 'authenticating' | 'authenticated';
export type User = {
  uid: string;
  email: string | null;
  username?: string;
};

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
        setAuthState('authenticated');
      } else {
        setUser(null);
        setAuthState('unauthenticated');
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState('authenticating');
    setError(null);
    // Implementation details in useFirebaseAuth
  };

  const register = async (email: string, password: string, username: string) => {
    setAuthState('authenticating');
    setError(null);
    // Implementation details in useFirebaseAuth
  };

  const logout = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      setUser(null);
      setAuthState('unauthenticated');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authState,
        isLoading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### `lib/hooks/useFirebaseAuth.ts`

Custom hook for Firebase authentication operations.

```typescript
// lib/hooks/useFirebaseAuth.ts

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  AuthError,
} from 'firebase/auth';
import { firebaseAuth, firebaseFirestore } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from './useAuth';

interface RegisterOptions {
  email: string;
  password: string;
  username: string;
}

interface LoginOptions {
  email: string;
  password: string;
}

export function useFirebaseAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async ({ email, password, username }: RegisterOptions): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username,
      };

      // Store user data in Firestore
      await setDoc(doc(firebaseFirestore, 'users', user.uid), {
        username: user.username,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      return user;
    } catch (err) {
      handleFirebaseError(err as AuthError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }: LoginOptions): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };

      return user;
    } catch (err) {
      handleFirebaseError(err as AuthError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirebaseError = (firebaseError: AuthError) => {
    switch (firebaseError.code) {
      case 'auth/email-already-in-use':
        setError('Email already registered. Please use a different email.');
        break;
      case 'auth/invalid-email':
        setError('Invalid email address.');
        break;
      case 'auth/weak-password':
        setError('Password should be at least 6 characters.');
        break;
      case 'auth/user-not-found':
        setError('No account found with this email.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password.');
        break;
      case 'auth/network-request-failed':
        setError('Network error. Please check your connection and try again.');
        break;
      default:
        setError('Registration failed. Please try again.');
    }
  };

  return {
    register,
    login,
    isLoading,
    error,
  };
}
```

### `components/entry-terminal/FirebaseRegistrationForm.tsx`

New form component that integrates with Firebase authentication.

```typescript
// components/entry-terminal/FirebaseRegistrationForm.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TerminalInput } from './TerminalInput';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';
import { validateRequired, validateEmail } from '@/lib/validation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import type { RegistrationFormValues } from '@/lib/types';

interface FirebaseRegistrationFormProps {
  onRegisterSuccess: (username: string) => void;
  onRegisterError: (message: string) => void;
}

export function FirebaseRegistrationForm({
  onRegisterSuccess,
  onRegisterError,
}: FirebaseRegistrationFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const {
    register: registerFirebase,
    isLoading: isFirebaseLoading,
    error: firebaseError,
  } = useFirebaseAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormValues>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsRegistering(true);
    
    try {
      await registerFirebase({
        email: data.email,
        password: generateSecurePassword(), // Generate a secure password
        username: data.username,
      });
      
      onRegisterSuccess(data.username);
      reset();
    } catch (err) {
      onRegisterError(firebaseError || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  // Generate a secure password for Firebase Auth
  const generateSecurePassword = (): string => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Username input */}
      <TerminalInput
        id="username"
        label="Username"
        type="text"
        placeholder="Enter username"
        autoComplete="username"
        error={errors.username?.message}
        disabled={isRegistering}
        {...register('username', {
          validate: (value) => {
            if (!validateRequired(value)) {
              return 'Username is required';
            }
            return true;
          },
        })}
      />

      {/* Email input */}
      <TerminalInput
        id="email"
        label="Email Address"
        type="email"
        placeholder="Enter email"
        autoComplete="email"
        error={errors.email?.message}
        disabled={isRegistering}
        {...register('email', {
          validate: (value) => {
            if (!validateRequired(value)) {
              return 'Email is required';
            }
            if (!validateEmail(value)) {
              return 'Invalid email format';
            }
            return true;
          },
        })}
      />

      {/* Password (hidden) */}
      <input
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
        className="hidden"
      />

      {/* Submit button */}
      <div className="pt-4">
        <MagneticButton
          type="submit"
          aria-label="Commit to challenge"
          disabled={isRegistering}
          className="
            bg-voidBlack 
            border-4 
            border-solid 
            border-cyberLime 
            text-cyberLime 
            font-mono 
            font-bold 
            px-8 
            py-3 
            min-h-[44px] 
            min-w-[44px]
            hover:bg-cyberLime/10
            transition-colors
            duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <GlitchText>
            {isRegistering ? 'PROCESSING...' : 'COMMIT TO CHALLENGE'}
          </GlitchText>
        </MagneticButton>
      </div>

      {/* Error message */}
      {firebaseError && (
        <div className="text-alertOrange text-sm mt-2">
          {firebaseError}
        </div>
      )}
    </form>
  );
}
```

### `components/entry-terminal/EntryTerminal.tsx` (Modified)

Updated to use Firebase authentication.

```typescript
// components/entry-terminal/EntryTerminal.tsx

'use client';

import { useState } from 'react';
import { FirebaseRegistrationForm } from './FirebaseRegistrationForm';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';
import { useAuth } from '@/lib/hooks/useAuth';

export function EntryTerminal() {
  const { user, authState, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterSuccess = (username: string) => {
    setSuccessMessage(`[OK] Registration committed for ${username}.`);
    setErrorMessage(null);
  };

  const handleRegisterError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage(null);
  };

  if (isLoading) {
    return (
      <section id="entry-terminal" className="w-full max-w-3xl mx-auto px-4 py-16">
        <div className="bg-voidBlack border-4 border-solid border-cyberLime font-mono p-6">
          <div className="text-cyberLime text-sm mb-4">
            <p>$ ./register_challenge.sh</p>
            <p className="text-cyberLime/70 mt-1">Initializing registration protocol...</p>
          </div>
          <div className="flex items-center gap-2 text-cyberLime">
            <div className="animate-spin">⟳</div>
            <span>Loading authentication system...</span>
          </div>
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section id="entry-terminal" className="w-full max-w-3xl mx-auto px-4 py-16">
        <div className="bg-voidBlack border-4 border-solid border-cyberLime font-mono p-6">
          <div className="text-cyberLime text-sm mb-4">
            <p>$ ./register_challenge.sh</p>
            <p className="text-cyberLime/70 mt-1">User already authenticated</p>
          </div>
          <div className="text-cyberLime font-bold text-lg mt-6">
            [OK] User authenticated: {user.email}
          </div>
          <div className="mt-4">
            <MagneticButton
              onClick={() => setShowLogin(true)}
              className="text-cyberLime hover:text-alertOrange transition-colors"
            >
              Switch Account
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }

  if (showLogin) {
    return (
      <section id="entry-terminal" className="w-full max-w-3xl mx-auto px-4 py-16">
        <div className="bg-voidBlack border-4 border-solid border-cyberLime font-mono">
          <div className="bg-cyberLime/10 border-b-4 border-cyberLime px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-alertOrange"></div>
              <div className="w-3 h-3 rounded-full bg-cyberLime"></div>
              <div className="w-3 h-3 rounded-full bg-cyberLime/50"></div>
            </div>
            <span className="ml-4 text-cyberLime text-sm">login.sh</span>
          </div>
          <div className="p-6">
            <div className="text-cyberLime text-sm mb-6">
              <p>$ ./login.sh</p>
              <p className="text-cyberLime/70 mt-1">Initializing login protocol...</p>
            </div>
            {/* Login form implementation */}
            <div className="text-alertOrange mt-4">
              Login functionality not yet implemented
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="entry-terminal" className="w-full max-w-3xl mx-auto px-4 py-16">
      <div className="bg-voidBlack border-4 border-solid border-cyberLime font-mono">
        <div className="bg-cyberLime/10 border-b-4 border-cyberLime px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-alertOrange"></div>
            <div className="w-3 h-3 rounded-full bg-cyberLime"></div>
            <div className="w-3 h-3 rounded-full bg-cyberLime/50"></div>
          </div>
          <span className="ml-4 text-cyberLime text-sm">entry_terminal.sh</span>
        </div>

        {successMessage ? (
          <div className="p-6">
            <div className="text-cyberLime text-sm mb-4">
              <p>$ ./register_challenge.sh</p>
              <p className="text-cyberLime/70 mt-1">Processing registration...</p>
            </div>
            <div className="text-cyberLime font-bold text-lg mt-6">
              {successMessage}
            </div>
          </div>
        ) : (
          <FirebaseRegistrationForm
            onRegisterSuccess={handleRegisterSuccess}
            onRegisterError={handleRegisterError}
          />
        )}
      </div>
    </section>
  );
}
```

---

## Data Models

### Extended `lib/types.ts`

```typescript
// lib/types.ts

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'PENDING' | 'VERIFIED';
}

export interface RegistrationFormValues {
  username: string;
  email: string;
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
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Registration creates user in Firebase Auth and Firestore

*For any* valid email, password, and username, the registration function SHALL create a user account in Firebase Authentication and store the user data in Firestore with the correct fields (`username`, `email`, `createdAt`).

**Validates: Requirements 1.1, 1.2, 5.1, 5.2**

### Property 2: Duplicate email registration fails with appropriate error

*For any* email that is already registered, the registration function SHALL fail with an error message containing "Email already registered" and SHALL NOT create a duplicate user account.

**Validates: Requirements 1.4**

### Property 3: Network errors are handled gracefully

*For any* network failure during registration, the system SHALL catch the error and return a user-friendly error message containing "Network error" without crashing the application.

**Validates: Requirements 1.5, 4.2**

### Property 4: Loading state is managed correctly

*For any* registration request, the loading state SHALL be `true` during the request and `false` after completion (success or failure), and the submit button SHALL be disabled during loading.

**Validates: Requirements 3.2, 3.3**

### Property 5: Error messages are displayed correctly

*For any* error condition, the error message SHALL be displayed in Alert Orange (`#FF5F1F`) color and SHALL contain appropriate error text for the specific error type.

**Validates: Requirements 4.1, 4.2, 4.3, 4.5**

### Property 6: User data validation is enforced

*For any* user document in Firestore, the `username` and `email` fields SHALL be non-empty strings and the `createdAt` field SHALL be a valid timestamp.

**Validates: Requirements 5.4, 5.5**

---

## Error Handling

### Firebase Authentication Errors

- **Email already in use**: Display "Email already registered. Please use a different email."
- **Invalid email**: Display "Invalid email address."
- **Weak password**: Display "Password should be at least 6 characters."
- **User not found**: Display "No account found with this email."
- **Wrong password**: Display "Incorrect password."
- **Network request failed**: Display "Network error. Please check your connection and try again."
- **Other errors**: Display generic "Registration failed. Please try again."

### Form Validation Errors

- Empty required fields: Inline error message in `#FF5F1F` rendered beneath the offending field via React Hook Form's `errors` object
- Invalid email format: Same inline error treatment
- Errors are cleared when the field value changes and re-validated on blur and submit

### Loading State Errors

- If loading state doesn't clear: Implement a timeout fallback to reset loading state after 30 seconds
- If error state doesn't clear: Implement a clear error function that can be called on field changes

### Accessibility Fallbacks

- All form inputs have associated `<label>` elements
- All interactive elements have `aria-label` attributes
- Focus indicators use a `#39FF14` outline with sufficient contrast
- Keyboard navigation is fully supported

---

## Testing Strategy

### PBT Applicability Assessment

This feature involves Firebase integration with authentication and data persistence. The core logic includes:

1. **`useFirebaseAuth` hook** — Pure functions for registration and login with Firebase SDK
2. **Error handling** — Pure functions for mapping Firebase error codes to user-friendly messages
3. **Data validation** — Pure functions for validating user input

Property-based testing is appropriate for:
- Error handling logic (mapping error codes to messages)
- Data validation (email, username validation)
- Loading state transitions

Property-based testing is NOT appropriate for:
- Firebase SDK integration (external service, use integration tests)
- UI rendering (use snapshot tests)
- Authentication state management (use example-based tests)

**Property-based testing library:** [fast-check](https://github.com/dubzzz/fast-check) (TypeScript-native, well-maintained, integrates with Vitest/Jest)

### Unit Tests (Vitest + React Testing Library)

**`lib/hooks/useFirebaseAuth.ts`**
- Registration with valid credentials creates user in Firebase Auth and Firestore
- Registration with duplicate email fails with appropriate error
- Network errors are handled gracefully
- Error message mapping for different Firebase error codes

**`components/entry-terminal/FirebaseRegistrationForm.tsx`**
- Submitting with empty fields shows inline error messages
- Submitting with valid data triggers registration
- Loading state disables submit button
- Error messages are displayed in Alert Orange

**`components/entry-terminal/EntryTerminal.tsx`**
- Loading state shows loading indicator
- Success state shows success message
- Error state shows error message

### Property-Based Tests (fast-check, minimum 100 iterations each)

**Feature: firebase-registration, Property 1: Error message mapping is correct**
- Generate arbitrary Firebase error codes; verify that `handleFirebaseError` returns the correct user-friendly message for each code

**Feature: firebase-registration, Property 2: Loading state transitions are correct**
- Generate arbitrary sequences of loading states; verify that loading state is `true` during operations and `false` after completion

**Feature: firebase-registration, Property 3: Error messages are displayed correctly**
- Generate arbitrary error messages; verify that error messages are displayed in Alert Orange color

### Snapshot Tests (Vitest + React Testing Library)

- `FirebaseRegistrationForm` renders all form fields correctly
- `FirebaseRegistrationForm` shows loading state with spinner
- `FirebaseRegistrationForm` shows error message in Alert Orange
- `EntryTerminal` renders in loading, success, and error states

### Integration Tests (Vitest + React Testing Library)

- End-to-end registration flow: User fills form, submits, sees success message
- End-to-end error handling: User submits invalid data, sees appropriate error message
- Authentication state persistence: User refreshes page, remains authenticated

### Firebase Emulator Tests

- Use Firebase Emulator Suite to test Firebase Auth and Firestore integration
- Test registration, login, and logout flows
- Test error handling for various error conditions

### `prefers-reduced-motion` Tests

- When `prefers-reduced-motion: reduce` is set, animations use opacity-only transitions
- Loading spinner uses CSS animation that respects reduced motion setting

---

## Environment Variables

Add the following to `.env.local`:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Deployment Considerations

1. **Firebase Setup**: Create a Firebase project and enable Authentication and Firestore
2. **Security Rules**: Configure Firestore security rules to prevent unauthorized access
3. **Environment Variables**: Never commit `.env.local` to version control
4. **Production Build**: Run `next build` to create production bundle
5. **Environment Variables in Production**: Set environment variables in your hosting platform (Vercel, Netlify, etc.)

### Firestore Security Rules (example)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Migration Path

1. **Install Firebase SDK**: `npm install firebase`
2. **Create Firebase Project**: Set up Firebase project and enable services
3. **Add Environment Variables**: Add Firebase configuration to `.env.local`
4. **Create Firebase Configuration**: Create `lib/firebase.ts`
5. **Create Auth Hook**: Create `lib/hooks/useAuth.ts`
6. **Create Firebase Auth Hook**: Create `lib/hooks/useFirebaseAuth.ts`
7. **Create Firebase Form**: Create `components/entry-terminal/FirebaseRegistrationForm.tsx`
8. **Update EntryTerminal**: Modify `components/entry-terminal/EntryTerminal.tsx`
9. **Update Layout**: Wrap app with `AuthProvider` in `app/layout.tsx`
10. **Test**: Run tests and verify functionality
11. **Deploy**: Deploy to production and test with real Firebase backend