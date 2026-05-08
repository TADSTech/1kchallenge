'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { firebaseAuth, firebaseFirestore } from '../firebase';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, limit, getDoc } from 'firebase/firestore';

export type AuthState = 'unauthenticated' | 'authenticating' | 'authenticated';

export interface User {
  uid: string;
  email: string | null;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const handleAuthError = (err: AuthError): string => {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'Email already registered. Access denied.';
    case 'auth/invalid-email':
      return 'Invalid email format. Check your input.';
    case 'auth/weak-password':
      return 'Password too weak. Security compromised.';
    case 'auth/user-not-found':
      return 'No account found with this identifier.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect credentials. Authentication failed.';
    case 'auth/network-request-failed':
      return 'Network disruption detected. Check connection.';
    default:
      return err.message || 'Authentication protocol failure.';
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch username from Firestore
        const userDoc = await getDoc(doc(firebaseFirestore, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: userData?.username,
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

  const login = async (identifier: string, password: string) => {
    setAuthState('authenticating');
    setError(null);

    try {
      let email = identifier;

      // Username lookup
      if (!identifier.includes('@')) {
        const q = query(collection(firebaseFirestore, 'users'), where('username', '==', identifier), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw { code: 'auth/user-not-found' } as AuthError;
        }
        
        const userData = querySnapshot.docs[0].data();
        email = userData.email;
      }

      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      // Get additional info from Firestore
      const userDoc = await getDoc(doc(firebaseFirestore, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username: userData?.username,
      });
      setAuthState('authenticated');
    } catch (err) {
      const msg = handleAuthError(err as AuthError);
      setError(msg);
      setAuthState('unauthenticated');
      throw err;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setAuthState('authenticating');
    setError(null);

    try {
      // Username uniqueness check
      const q = query(collection(firebaseFirestore, 'users'), where('username', '==', username), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error('USERNAME_TAKEN');
      }

      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      const newUser: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username,
      };

      // Store user data in Firestore
      await setDoc(doc(firebaseFirestore, 'users', newUser.uid), {
        username,
        email,
        createdAt: serverTimestamp(),
      });

      setUser(newUser);
      setAuthState('authenticated');
    } catch (err) {
      let msg = 'Registration failed.';
      if (err instanceof Error && err.message === 'USERNAME_TAKEN') {
        msg = 'Username already claimed by another operative.';
      } else {
        msg = handleAuthError(err as AuthError);
      }
      setError(msg);
      setAuthState('unauthenticated');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      setUser(null);
      setAuthState('unauthenticated');
      setError(null);
    } catch (err) {
      setError('Failed to terminate session.');
      throw err;
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
