'use client'; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';
import AutoLogout from '@/components/dashboard/AutoLogout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/#');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div role="status" aria-live="polite">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
   
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
       <AutoLogout />
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 p-6 bg-background overflow-y-auto">{children}</div>
      </main>
    </div>
  );
  
}
