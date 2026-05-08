'use client';

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

  return {
    register,
    login,
    isLoading,
    error,
    handleFirebaseError,
  };
}
