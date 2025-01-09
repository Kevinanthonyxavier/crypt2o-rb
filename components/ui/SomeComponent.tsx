'use client';

import React from 'react';
import { useToast } from '@/components/ui/use-toast'; // Ensure this path is correct

const SomeComponent = () => {
  // Destructure the `toast` function from `useToast`
  const { toast } = useToast();

  // Function to handle button click and trigger a toast
  const handleShowToast = () => {
    toast({
      title: 'Notification',
      description: 'Hello, this is a toast message!', // Customize your toast message here
    });
  };

  return (
    <div className="p-4">
      <button
        onClick={handleShowToast} // On button click, show toast
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Toast
      </button>
    </div>
  );
};

export default SomeComponent;
