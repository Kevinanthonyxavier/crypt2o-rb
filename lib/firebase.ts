import { initializeApp, getApps, getApp, FirebaseError  } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

// Example function to handle user sign-in
export const handleSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User  signed in successfully:", userCredential);
  } catch (error) {
    if (error instanceof FirebaseError) {
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/wrong-password':
          console.error('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          console.error('No user found with this email.');
          break;
        case 'auth/invalid-email':
          console.error('The email address is not valid.');
          break;
        default:
          console.error('An error occurred during sign-in:', error.message);
      }
    } else {
      // Handle non-Firebase errors
      console.error('An unknown error occurred:', error);
    }
  }
};