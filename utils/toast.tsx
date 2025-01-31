// utils/toast.tsx

'use client'; // Mark this file as a client component

import toast, { Toaster } from 'react-hot-toast';

// Function to show toast
export const showToast = ({
  title,
  description,
  variant = 'default',
}: {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'destructive'; // Add 'destructive' to the variant options
}) => {
  // Show the toast with default toast options
  toast.custom((t) => (
    <>
      {/* Background overlay */}
      {t.visible && <div className="toast-overlay" />}
      {/* Toast notification */}
      <div className={`toast toast-${variant} ${t.visible ? 'opacity-100' : 'opacity-0'}`}>
        <strong className="toast-title">{title}</strong>
        {description && <p className="text-center toast-description">{description}</p>}
      </div>
    </>
  ), {
    duration: 3000, // Show toast for 3 seconds
  });
};

// Export the ToastContainer for use in your app
export const ToastContainer = () => (
  <Toaster position="top-center" />
);
