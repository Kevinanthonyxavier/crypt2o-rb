// contexts/UserContext.tsx
'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'
import { User } from '@/types/user'

// Define context types
interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  updateUser: (userData: Partial<User>) => void
}

// Create context
export const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null) // user is initially null

  // Method to update user data
  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
