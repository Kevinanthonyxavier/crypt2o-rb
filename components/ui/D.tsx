'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Type definition for Toast
type Toast = {
  id: number;
  message: string;
};

// Type definition for Toast context
interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string) => void;
  removeToast: (id: number) => void;
}

// Creating ToastContext with undefined initial state
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Custom hook to use the Toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    // Ensure that `useToast` is used within a `ToastProvider`
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

// Type for ToastProvider props, children of type ReactNode
interface ToastProviderProps {
  children: ReactNode;
}

// ToastProvider component that provides the context to the component tree
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  // State to keep track of active toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  let idCounter = 0; // Simple counter to generate unique IDs for toasts

  // Function to add a toast
  const addToast = (message: string) => {
    const newToast = { id: idCounter++, message };
    setToasts((prev) => [...prev, newToast]);

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
      removeToast(newToast.id);
    }, 3000);
  };

  // Function to remove a toast by its ID
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Return the context provider wrapping children components
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
