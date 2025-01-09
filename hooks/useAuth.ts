import { useContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
 // User as FirebaseUser
} from 'firebase/auth'
import { auth as firebaseAuth } from '@/lib/firebase'
import { UserContext } from '@/contexts/UserContext'
import { User } from '@/types/user'

interface SignUpAdditionalData {
  name?: string
  referralCode?: string
  accountLevel?: User['accountLevel']
}

export const useAuth = () => {
  const context = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  if (!context) {
    throw new Error('useAuth must be used within a UserProvider')
  }

  const { user, setUser, updateUser } = context

  // Utility to map Firebase user to User interface
  // const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  //   return {
  //     id: firebaseUser.uid,
  //     name: firebaseUser.displayName || 'User',
  //     email: firebaseUser.email || '',
  //     accountNumber: generateAccountNumber(),
  //     isVerified: firebaseUser.emailVerified,
  //     accountLevel: 'Bronze'
  //   }
  // }

  // Sign up method
  const signUp = async (
    email: string, 
    password: string, 
    additionalData?: SignUpAdditionalData
  ): Promise<User> => {
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format')
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      
      const newUser: User = {
        id: userCredential.user.uid,
        name: additionalData?.name || 'User',
        email: email,
        accountNumber: generateAccountNumber(),
        isVerified: false,
        accountLevel: additionalData?.accountLevel || 'Bronze'
      }

      updateUser(newUser)
      return newUser
    } catch (error) {
      console.error('Sign up error', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign in method
  const signIn = async (email: string, password: string): Promise<User> => {
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      
      const signedInUser: User = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || 'User',
        email: userCredential.user.email || '',
        accountNumber: generateAccountNumber(),
        isVerified: userCredential.user.emailVerified,
        accountLevel: 'Bronze'
      }

      updateUser(signedInUser)
      return signedInUser
    } catch (error) {
      console.error('Sign in error', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Google Sign In
  const signInWithGoogle = async (): Promise<User> => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(firebaseAuth, provider)
      
      if (!result.user.email) {
        throw new Error('No email associated with Google account')
      }

      const googleUser: User = {
        id: result.user.uid,
        name: result.user.displayName || 'Google User',
        email: result.user.email,
        accountNumber: generateAccountNumber(),
        isVerified: result.user.emailVerified,
        accountLevel: 'Bronze'
      }

      updateUser(googleUser)
      return googleUser
    } catch (error) {
      console.error('Google sign in error', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout method
  const logout = async () => {
    try {
      await signOut(firebaseAuth)
      setUser(null)
    } catch (error) {
      console.error('Logout error', error)
      throw error
    }
  }

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const authUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          accountNumber: generateAccountNumber(),
          isVerified: firebaseUser.emailVerified,
          accountLevel: 'Bronze'
        }

        updateUser(authUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, updateUser])

  // Utility functions
  function generateAccountNumber(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString()
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout
  }
}
