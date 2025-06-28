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
    let mounted = true

    // Função para carregar perfil do usuário
    async function loadUserProfile(userId: string) {
      try {
        const { data: profileData, error: profileError } = await auth.getUserProfile(userId)
        if (!profileError && profileData && mounted) {
          setProfile(profileData)
        } else if (mounted) {
          // Se não encontrar perfil, criar um básico
          const basicProfile: UserProfile = {
            id: userId,
            email: user?.email || '',
            full_name: user?.user_metadata?.full_name || user?.email || '',
            role: 'user',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setProfile(basicProfile)
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        if (mounted) {
          // Criar perfil básico em caso de erro
          const basicProfile: UserProfile = {
            id: userId,
            email: user?.email || '',
            full_name: user?.user_metadata?.full_name || user?.email || '',
            role: 'user',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setProfile(basicProfile)
        }
      }
    }

    // Verificar usuário atual
    async function checkCurrentUser() {
      try {
        const { user: currentUser } = await auth.getCurrentUser()
        
        if (mounted) {
          if (currentUser) {
            setUser(currentUser)
            await loadUserProfile(currentUser.id)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Executar verificação inicial
    checkCurrentUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      try {
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('Erro no auth state change:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    setLoading(true)
    try {
      const { data, error } = await auth.signIn(email, password)
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