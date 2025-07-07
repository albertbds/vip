import { supabase } from './supabase'

export interface Sale {
  id: string
  user_id: string
  client_name: string
  contract_number: string
  phone: string
  email?: string
  address: string
  plan: string
  value: number
  status: 'ag-instalacao' | 'instalada' | 'reprovada'
  installation_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateSaleData {
  client_name: string
  contract_number?: string
  phone: string
  plan: string
  value: number
  status: 'ag-instalacao' | 'instalada' | 'reprovada'
  installation_date?: string
  notes?: string
}

export interface UpdateSaleData extends Partial<CreateSaleData> {
  id: string
}

// Funções para gerenciar vendas
export const salesService = {
  // Garantir que o perfil do usuário existe
  async ensureUserProfile(userId: string, userEmail?: string): Promise<{ success: boolean, error: any }> {
    if (!supabase) {
      return { success: true, error: null }
    }

    try {
      // Primeiro verificar se o perfil já existe
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar perfil existente:', checkError)
        return { success: false, error: checkError }
      }

      // Se o perfil já existe, retornar sucesso
      if (existingProfile) {
        return { success: true, error: null }
      }

      // Se não existe, tentar criar
      console.log('Perfil não encontrado, criando para usuário:', userId)
      
      // Buscar dados do usuário no auth.users se necessário
      let email = userEmail
      if (!email) {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (user && user.id === userId) {
          email = user.email
        }
      }

      // Criar perfil básico
      const profileData = {
        id: userId,
        email: email || 'user@example.com',
        full_name: email ? email.split('@')[0] : 'Usuário',
        role: 'user',
        is_active: true
      }

      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single()

      if (createError) {
        console.error('Erro ao criar perfil:', createError)
        return { success: false, error: createError }
      }

      console.log('Perfil criado com sucesso:', newProfile)
      return { success: true, error: null }
    } catch (error) {
      console.error('Erro inesperado ao garantir perfil:', error)
      return { success: false, error }
    }
  },

  // Buscar todas as vendas do usuário atual
  async getUserSales(userId: string): Promise<{ data: Sale[] | null, error: any }> {
    if (!supabase) {
      // Modo fallback - retornar dados mock
      const mockSales: Sale[] = [
        {
          id: '1',
          user_id: userId,
          client_name: 'João Silva Santos',
          contract_number: 'CT-2025-001',
          phone: '(85) 99999-9999',
          email: 'joao.silva@email.com',
          address: 'Rua das Flores, 123 - Aldeota, Fortaleza - CE',
          plan: '600MB',
          value: 99.99,
          status: 'ag-instalacao',
          installation_date: '2025-01-30',
          notes: 'Cliente preferiu instalação pela manhã',
          created_at: '2025-01-28T10:00:00Z',
          updated_at: '2025-01-28T10:00:00Z'
        }
      ]
      return { data: mockSales, error: null }
    }

    try {
      // Garantir que o perfil existe antes de buscar vendas
      await this.ensureUserProfile(userId)

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro do Supabase ao buscar vendas:', error)
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      return { data: null, error }
    }
  },

  // Criar nova venda
  async createSale(userId: string, saleData: CreateSaleData): Promise<{ data: Sale | null, error: any }> {
    if (!supabase) {
      // Modo fallback - simular criação
      const newSale: Sale = {
        id: Date.now().toString(),
        user_id: userId,
        contract_number: saleData.contract_number || this.generateContractNumber(),
        ...saleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return { data: newSale, error: null }
    }

    try {
      // Garantir que o perfil do usuário existe antes de criar a venda
      const { success: profileSuccess, error: profileError } = await this.ensureUserProfile(userId)
      
      if (!profileSuccess) {
        console.error('Falha ao garantir perfil do usuário:', profileError)
        return { 
          data: null, 
          error: { 
            message: 'Erro ao verificar perfil do usuário. Tente fazer login novamente.',
            details: profileError 
          }
        }
      }

      // Garantir que o contract_number seja gerado se não fornecido
      const contractNumber = saleData.contract_number || this.generateContractNumber()
      
      const insertData = {
        user_id: userId,
        client_name: saleData.client_name,
        contract_number: contractNumber,
        phone: saleData.phone,
        plan: saleData.plan,
        value: saleData.value,
        status: saleData.status,
        installation_date: saleData.installation_date || null,
        notes: saleData.notes || null
      }

      console.log('Dados para inserção:', insertData)

      const { data, error } = await supabase
        .from('sales')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        console.error('Erro do Supabase ao criar venda:', error)
        
        // Tratamento específico para erro de chave estrangeira
        if (error.code === '23503' && error.message.includes('sales_user_id_fkey')) {
          return { 
            data: null, 
            error: { 
              message: 'Erro de perfil de usuário. Tente fazer logout e login novamente.',
              details: error 
            }
          }
        }
        
        return { data: null, error }
      }

      console.log('Venda criada com sucesso:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao criar venda:', error)
      return { data: null, error }
    }
  },

  // Atualizar venda existente
  async updateSale(saleData: UpdateSaleData): Promise<{ data: Sale | null, error: any }> {
    if (!supabase) {
      // Modo fallback - simular atualização
      return { data: saleData as Sale, error: null }
    }

    try {
      const { id, ...updateData } = saleData
      
      // Remover campos undefined
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      )

      console.log('Dados para atualização:', cleanUpdateData)

      const { data, error } = await supabase
        .from('sales')
        .update(cleanUpdateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro do Supabase ao atualizar venda:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro ao atualizar venda:', error)
      return { data: null, error }
    }
  },

  // Deletar venda
  async deleteSale(saleId: string): Promise<{ error: any }> {
    if (!supabase) {
      // Modo fallback - simular deleção
      return { error: null }
    }

    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId)

      if (error) {
        console.error('Erro do Supabase ao deletar venda:', error)
      }

      return { error }
    } catch (error) {
      console.error('Erro ao deletar venda:', error)
      return { error }
    }
  },

  // Gerar número de contrato único
  generateContractNumber(): string {
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `CT-${year}-${timestamp}${random}`
  },

  // Buscar vendas por status
  async getSalesByStatus(userId: string, status: Sale['status']): Promise<{ data: Sale[] | null, error: any }> {
    if (!supabase) {
      return { data: [], error: null }
    }

    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', userId)
        .eq('status', status)
        .order('created_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      console.error('Erro ao buscar vendas por status:', error)
      return { data: null, error }
    }
  },

  // Buscar vendas por período
  async getSalesByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{ data: Sale[] | null, error: any }> {
    if (!supabase) {
      return { data: [], error: null }
    }

    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      console.error('Erro ao buscar vendas por período:', error)
      return { data: null, error }
    }
  },

  // Verificar se o usuário tem acesso ao sistema de vendas
  async checkUserAccess(userId: string): Promise<{ hasAccess: boolean, error: any }> {
    if (!supabase) {
      return { hasAccess: true, error: null }
    }

    try {
      // Garantir que o perfil existe
      await this.ensureUserProfile(userId)

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, is_active')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Erro ao verificar acesso do usuário:', error)
        return { hasAccess: false, error }
      }

      return { hasAccess: data?.is_active || false, error: null }
    } catch (error) {
      console.error('Erro ao verificar acesso:', error)
      return { hasAccess: false, error }
    }
  }
}