declare module 'sonner' {
  import React from 'react'

  // Toast options interface
  interface ToastOptions {
    description?: string
    duration?: number
    icon?: React.ReactNode
  }

  // Main toast function
  export function toast(message: string, options?: ToastOptions): void
  export namespace toast {
    function success(message: string, options?: ToastOptions): void
    function error(message: string, options?: ToastOptions): void
    function info(message: string, options?: ToastOptions): void
    function warning(message: string, options?: ToastOptions): void
  }

  // Toaster props interface
  export interface ToasterProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    richColors?: boolean
    closeButton?: boolean
    duration?: number
  }

  // The Toaster component
  export const Toaster: React.FC<ToasterProps>

  // Alternative toast function with title and description
  export function toast(options: { title: string; description?: string; type?: string }): void
}
