import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, UserProfile } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { salesService } from '../lib/sales'

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

  // Limpar sessão ao carregar a página
  useEffect(() => {
    const clearSessionOnLoad = async () => {
      if (supabase) {
        try {
          // Fazer logout silencioso ao carregar a página
          await supabase.auth.signOut()
          
          // Limpar qualquer dado persistido no localStorage
          const keys = Object.keys(localStorage)
          keys.forEach(key => {
            if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
              localStorage.removeItem(key)
            }
          })
          
          // Limpar sessionStorage também
          const sessionKeys = Object.keys(sessionStorage)
          sessionKeys.forEach(key => {
            if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
              sessionStorage.removeItem(key)
            }
          })
        } catch (error) {
          console.warn('Erro ao limpar sessão inicial:', error)
        }
      }
    }
    
    clearSessionOnLoad()
  }, [])

  useEffect(() => {
    let mounted = true

    // Função para carregar perfil do usuário
    async function loadUserProfile(userId: string, userEmail?: string) {
      try {
        // Garantir que o perfil existe
        await salesService.ensureUserProfile(userId, userEmail)
        
        const { data: profileData, error: profileError } = await auth.getUserProfile(userId)
        if (!profileError && profileData && mounted) {
          setProfile(profileData)
        } else if (mounted) {
          // Se não encontrar perfil, criar um básico
          const basicProfile: UserProfile = {
            id: userId,
            email: user?.email || userEmail || '',
            full_name: user?.user_metadata?.full_name || user?.email || userEmail || '',
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
            email: user?.email || userEmail || '',
            full_name: user?.user_metadata?.full_name || user?.email || userEmail || '',
            role: 'user',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setProfile(basicProfile)
        }
      }
    }

    // Verificar usuário atual com tratamento de erro de token
    async function checkCurrentUser() {
      try {
        const { user: currentUser, error } = await auth.getCurrentUser()
        
        if (mounted) {
          if (currentUser && !error) {
            setUser(currentUser)
            await loadUserProfile(currentUser.id, currentUser.email)
          } else {
            // Se houver erro ou não houver usuário, limpar estado
            setUser(null)
            setProfile(null)
          }
          setLoading(false)
        }
      } catch (error: any) {
        console.error('Erro ao verificar usuário:', error)
        
        // Se for erro de token, limpar estado
        if (error?.message?.includes('refresh_token_not_found') ||
            error?.message?.includes('Invalid Refresh Token') ||
            error?.message?.includes('refresh token')) {
          console.warn('Erro de token detectado no contexto, limpando estado...')
          if (mounted) {
            setUser(null)
            setProfile(null)
          }
        }
        
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
          await loadUserProfile(session.user.id, session.user.email)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error: any) {
        console.error('Erro no auth state change:', error)
        
        // Se for erro de token, limpar estado
        if (error?.message?.includes('refresh_token_not_found') ||
            error?.message?.includes('Invalid Refresh Token') ||
            error?.message?.includes('refresh token')) {
          console.warn('Erro de token detectado no state change, limpando estado...')
          if (mounted) {
            setUser(null)
            setProfile(null)
          }
        }
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
      
      // Se login bem-sucedido, garantir que o perfil existe
      if (data?.user && !error) {
        await salesService.ensureUserProfile(data.user.id, data.user.email)
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
      
      // Se registro bem-sucedido, garantir que o perfil existe
      if (data?.user && !error) {
        await salesService.ensureUserProfile(data.user.id, data.user.email)
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
      
      // Limpar todos os dados relacionados à autenticação
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth') || 
            key.includes('notifications_') || key.includes('saleFormData') || 
            key.includes('citySearchCounts')) {
          localStorage.removeItem(key)
        }
      })
      
      const sessionKeys = Object.keys(sessionStorage)
      sessionKeys.forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
          sessionStorage.removeItem(key)
        }
      })
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