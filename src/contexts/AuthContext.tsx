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
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let isMounted = true

    // Função para verificar usuário atual apenas uma vez
    async function initializeAuth() {
      if (initialized) return

      try {
        const { user: currentUser } = await auth.getCurrentUser()
        
        if (!isMounted) return

        if (currentUser) {
          setUser(currentUser)
          // Carregar perfil apenas se o usuário existir
          try {
            const { data: profileData, error: profileError } = await auth.getUserProfile(currentUser.id)
            if (!profileError && profileData && isMounted) {
              setProfile(profileData)
            }
          } catch (profileErr) {
            console.error('Erro ao carregar perfil:', profileErr)
          }
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Inicializar autenticação
    initializeAuth()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return

      try {
        if (session?.user) {
          setUser(session.user)
          // Carregar perfil do usuário
          try {
            const { data: profileData, error: profileError } = await auth.getUserProfile(session.user.id)
            if (!profileError && profileData && isMounted) {
              setProfile(profileData)
            }
          } catch (profileErr) {
            console.error('Erro ao carregar perfil:', profileErr)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('Erro no auth state change:', error)
      } finally {
        if (isMounted && initialized) {
          setLoading(false)
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [initialized])

  async function signIn(email: string, password: string) {
    setLoading(true)
    try {
      const { data, error } = await auth.signIn(email, password)
      if (!error && data.user) {
        setUser(data.user)
        // O perfil será carregado pelo onAuthStateChange
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
        setUser(data.user)
        // O perfil será criado automaticamente pelo trigger
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