'use client';

import { Toaster } from 'react-hot-toast';

// Export a ToastContainer component
export const ToastContainer = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />
  );
};
