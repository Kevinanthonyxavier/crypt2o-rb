"use client"; // 👈 Required for Client Components in Next.js (App Router)

import { useEffect, useRef, useCallback } from "react";
import { auth } from "@/lib/firebase";

const AutoLogout = () => {
  const INACTIVITY_LIMIT = 50 * 60 * 1000; // 10 minutes

  const timer = useRef<NodeJS.Timeout | null>(null);

  // Logout function
  // const handleLogout = () => {
  //   localStorage.removeItem("authToken"); // Clear token
  //   router.push("/"); // Redirect to login page
  // };

  const handleLogout = useCallback(() => {
    auth.signOut();
    localStorage.clear();
    // if (typeof window !== 'undefined') {
    //   console.log(window.location.href = "/home"); // This will only execute in the browser
    // }
  }, []);
  // Reset inactivity timer
 // Reset inactivity timer
 const resetTimer = useCallback(() => {
  if (timer.current) clearTimeout(timer.current);
  timer.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
}, [handleLogout, INACTIVITY_LIMIT]);


  // Add event listeners
  useEffect(() => {
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  },  [resetTimer]);

  return null; // No UI needed
};

export default AutoLogout;
