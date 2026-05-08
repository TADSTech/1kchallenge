'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseAuth, firebaseFirestore } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });
      setAuthState('authenticated');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setAuthState('authenticating');
    setError(null);

    try {
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
      setError('Registration failed. Please try again.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      setUser(null);
      setAuthState('unauthenticated');
    } catch (err) {
      setError('Failed to logout');
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
