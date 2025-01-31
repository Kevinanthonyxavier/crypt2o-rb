//'use client'

import { UserProvider } from '@/contexts/UserContext';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import  {ToastContainer}  from '@/utils/toast';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Crypt2o.com",
  description: "Best Crypto Banking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FirebaseProvider>
          <UserProvider> {/* Correctly using UserProvider */}
            
              {children}
              <ToastContainer />
          </UserProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}