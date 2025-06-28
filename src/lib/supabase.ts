import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// Funções de autenticação
export const auth = {
  // Registrar novo usuário
  async signUp(email: string, password: string, fullName?: string) {
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
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Erro no signOut:', error)
      return { error }
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      return { user: null, error }
    }
  },

  // Obter perfil do usuário
  async getUserProfile(userId: string): Promise<{ data: UserProfile | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      return { data, error }
    } catch (error) {
      console.error('Erro ao obter perfil:', error)
      return { data: null, error }
    }
  },

  // Atualizar perfil do usuário
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
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

  // Escutar mudanças de autenticação
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}