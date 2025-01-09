'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Auth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence,
  sendEmailVerification,
} from 'firebase/auth';
import { app, auth, db } from '@/lib/firebase';

// Firebase Context Interface
interface FirebaseContextType {
  app: typeof app;
  auth: Auth;
  db: typeof db;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>; // Added here
}

// Create Firebase Context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Firebase Provider Component
export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const googleProvider = new GoogleAuthProvider();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);

  // Set authentication persistence to localStorage
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('Persistence set to localStorage'))
      .catch((error) => console.error('Persistence setup failed:', error));
  }, []);

  // Authentication Methods
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('Sign-in failed. Please check your credentials.');
      console.error('Sign In Error', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('Sign-up failed. Please try again.');
      console.error('Sign Up Error', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError('Google Sign In failed. Please try again.');
      console.error('Google Sign In Error', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError('Logout failed. Please try again.');
      console.error('Logout Error', error);
      throw error;
    }
  };

  // Send Verification Email
  const sendVerificationEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        console.log('Verification email sent!');
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw error; // Handle the error as needed
      }
    } else {
      throw new Error('No user is currently signed in.');
    }
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Context Value
  const contextValue: FirebaseContextType = {
    app,
    auth,
    db,
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    sendVerificationEmail, // Added here
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom Hook to use Firebase Context
export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }

  return context;
};

export type { Auth };
