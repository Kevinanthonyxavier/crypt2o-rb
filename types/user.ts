// src/types/user.ts
export interface User {
    id: string
    name: string
    email: string
    accountNumber: string
    isVerified: boolean
    accountLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
    // Optional fields
    profileImage?: string
    phoneNumber?: string
  }