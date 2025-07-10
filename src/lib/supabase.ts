import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found, using fallback mode')
}

// Criar cliente com configuração mais robusta
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
        flowType: 'pkce'
      }
    })
  : null

// Tipos para TypeScript
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin' | 'moderator'
  is_active: boolean
  created_at: string
  updated_at: string
}

// Função para limpar sessão inválida
async function clearInvalidSession() {
  if (!supabase) return
  
  try {
    // Limpar sessão do Supabase
    await supabase.auth.signOut()
    
    // Limpar localStorage e sessionStorage manualmente
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
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
    console.error('Erro ao limpar sessão:', error)
  }
}

// Funções de autenticação com fallback
export const auth = {
  // Registrar novo usuário
  async signUp(email: string, password: string, fullName?: string) {
    if (!supabase) {
      // Modo fallback - simular sucesso
      return { 
        data: { 
          user: { 
            id: 'demo-user', 
            email, 
            user_metadata: { full_name: fullName } 
          } 
        }, 
        error: null 
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      return { data, error }
    } catch (error) {
      console.error('Erro no signUp:', error)
      return { data: null, error }
    }
  },

  // Fazer login
  async signIn(email: string, password: string) {
    if (!supabase) {
      // Modo fallback - simular sucesso para credenciais de teste
      if (email === 'admin@gigafibra.com' && password === '123456') {
        return { 
          data: { 
            user: { 
              id: 'demo-admin', 
              email,
              user_metadata: { full_name: 'Administrador Demo' }
            } 
          }, 
          error: null 
        }
      }
      return { data: null, error: { message: 'Credenciais inválidas' } }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      console.error('Erro no signIn:', error)
      return { data: null, error }
    }
  },

  // Fazer logout
  async signOut() {
    if (!supabase) {
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Erro no signOut:', error)
      return { error }
    }
  },

  // Obter usuário atual com tratamento de erro de token
  async getCurrentUser() {
    if (!supabase) {
      return { user: null, error: null }
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      // Se houver erro relacionado ao refresh token, limpar sessão
      if (error && (
        error.message?.includes('refresh_token_not_found') ||
        error.message?.includes('Invalid Refresh Token') ||
        error.message?.includes('refresh token')
      )) {
        console.warn('Token de refresh inválido detectado, limpando sessão...')
        await clearInvalidSession()
        return { user: null, error: null }
      }
      
      return { user, error }
    } catch (error: any) {
      console.error('Erro ao obter usuário atual:', error)
      
      // Se for erro de token, limpar sessão
      if (error?.message?.includes('refresh_token_not_found') ||
          error?.message?.includes('Invalid Refresh Token') ||
          error?.message?.includes('refresh token')) {
        console.warn('Erro de token detectado, limpando sessão...')
        await clearInvalidSession()
        return { user: null, error: null }
      }
      
      return { user: null, error }
    }
  },

  // Obter perfil do usuário
  async getUserProfile(userId: string): Promise<{ data: UserProfile | null, error: any }> {
    if (!supabase) {
      // Modo fallback - retornar perfil demo
      const demoProfile: UserProfile = {
        id: userId,
        email: 'admin@gigafibra.com',
        full_name: 'Administrador Demo',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return { data: demoProfile, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      return { data, error }
    } catch (error) {
      console.error('Erro ao obter perfil:', error)
      return { data: null, error }
    }
  },

  // Atualizar perfil do usuário
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    if (!supabase) {
      return { data: null, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { data: null, error }
    }
  },

  // Verificar se usuário está autenticado
  async isAuthenticated() {
    try {
      const { user } = await this.getCurrentUser()
      return !!user
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      return false
    }
  },

  // Escutar mudanças de autenticação com tratamento de erro
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) {
      // Retornar um subscription mock
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      // Se houver erro de token, limpar sessão
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.warn('Falha ao renovar token, limpando sessão...')
        await clearInvalidSession()
      }
      
      callback(event, session)
    })
  }
}