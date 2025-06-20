import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, UserProfile } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar usuário atual ao carregar
    checkUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { user } = await auth.getCurrentUser()
      if (user) {
        setUser(user)
        await loadUserProfile(user.id)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadUserProfile(userId: string) {
    try {
      const { data, error } = await auth.getUserProfile(userId)
      if (error) {
        console.error('Erro ao carregar perfil:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  async function signIn(email: string, password: string) {
    setLoading(true)
    try {
      const { data, error } = await auth.signIn(email, password)
      if (!error && data.user) {
        setUser(data.user)
        await loadUserProfile(data.user.id)
      }
      return { error }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  async function signUp(email: string, password: string, fullName?: string) {
    setLoading(true)
    try {
      const { data, error } = await auth.signUp(email, password, fullName)
      if (!error && data.user) {
        // O perfil será criado automaticamente pelo trigger
        setUser(data.user)
      }
      return { error }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    setLoading(true)
    try {
      await auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return { error: 'Usuário não autenticado' }
    
    try {
      const { data, error } = await auth.updateUserProfile(user.id, updates)
      if (!error && data) {
        setProfile(data)
      }
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}