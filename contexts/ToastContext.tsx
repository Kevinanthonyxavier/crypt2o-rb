import React, { createContext, useContext, useState, ReactNode } from "react";

type Toast = {
  id: string;
  title: string;
  description: string;
  open: boolean;
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Define the props for ToastProvider
type ToastProviderProps = {
  children: ReactNode; // Specify that children is a valid ReactNode
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const newToast = { ...toast, id: Date.now().toString(), open: true };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
