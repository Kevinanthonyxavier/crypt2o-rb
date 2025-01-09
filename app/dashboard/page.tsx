'use client'; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Import your Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import the auth state change listener
import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';

// Define your component props type
interface DashboardLayoutProps {
  children: React.ReactNode; // Ensures children can be any ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Initialize with null

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is signed in
      } else {
        setIsAuthenticated(false); // No user is signed in
        router.push('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  // Show a loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div role="status" aria-live="polite">
          <p>Loading...</p>
          {/* You can replace this with a spinner or loading animation */}
        </div>
      </div>
    ); // Center loading message
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content with scrollable container */}
        <div className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}