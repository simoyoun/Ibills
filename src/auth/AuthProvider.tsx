import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { auth, googleProvider, appleProvider, db } from './firebase'
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  getIdToken
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

interface User {
  id: string
  email: string
  name: string
  photoURL?: string
  isAdmin?: boolean
  isSales?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string, isAdmin?: boolean, isSales?: boolean) => Promise<boolean>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  refreshUserClaims: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setUserWithClaims = async (firebaseUser: FirebaseUser) => {
    console.log('Setting user with claims')
    const tokenResult = await firebaseUser.getIdTokenResult()
    const userData = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || 'User',
      photoURL: firebaseUser.photoURL,
      isAdmin: tokenResult.claims.admin === true,
      isSales: tokenResult.claims.sales === true
    }
    console.log('User data:', userData)
    setUser(userData)
    return userData
  }

  useEffect(() => {
    console.log('Auth state changed listener setup')
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      console.log('Auth state changed:', firebaseUser)
      setIsLoading(true)
      try {
        if (firebaseUser) {
          await setUserWithClaims(firebaseUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error handling auth state change:', error)
      } finally {
        setIsLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const refreshUserClaims = async () => {
    if (auth.currentUser) {
      console.log('Refreshing user claims')
      await auth.currentUser.getIdToken(true) // Force token refresh
      await setUserWithClaims(auth.currentUser)
    }
  }

  const login = async (email: string, password: string) => {
    console.log('Attempting login with:', email)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Login successful, user:', userCredential.user)
      await setUserWithClaims(userCredential.user)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const signUp = async (email: string, password: string, name: string, isAdmin = false, isSales = false) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      
      await fetch('https://us-central1-ibills-79a61.cloudfunctions.net/setCustomClaims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          claims: { admin: isAdmin, sales: isSales }
        })
      })

      await setDoc(doc(db, 'employees', userCredential.user.uid), {
        name,
        email,
        isAdmin,
        isSales,
        createdAt: new Date()
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
    isAuthenticated: !!user,
    refreshUserClaims
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
