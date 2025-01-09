import React, { ReactNode } from "react";
import { useToast } from "@/contexts/ToastContext"; // Ensure this path is correct

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, dismiss } = useToast();

  return (
    <div>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.open ? "open" : ""}`}>
            <div className="toast-content">
              <strong>{toast.title}</strong>
              <p>{toast.description}</p>
            </div>
            <button onClick={() => dismiss(toast.id)}>Dismiss</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastProvider;
