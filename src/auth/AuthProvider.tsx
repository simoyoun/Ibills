import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { auth, googleProvider, appleProvider } from './firebase'
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} from 'firebase/auth'

interface User {
  id: string
  email: string
  name: string
  photoURL?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL
        })
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, {
        displayName: name
      })
      return true
    } catch (error) {
      console.error('Sign up error:', error)
      return false
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Google sign in error:', error)
    }
  }

  const signInWithApple = async () => {
    try {
      await signInWithPopup(auth, appleProvider)
    } catch (error) {
      console.error('Apple sign in error:', error)
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    login,
    signUp,
    signInWithGoogle,
    signInWithApple,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
