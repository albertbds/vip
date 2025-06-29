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
  contract_number: string
  phone: string
  email?: string
  address: string
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
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
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
        ...saleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return { data: newSale, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([{ ...saleData, user_id: userId }])
        .select()
        .single()

      return { data, error }
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
      const { data, error } = await supabase
        .from('sales')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
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
    return `CT-${year}-${timestamp}`
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

      return { data, error }
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

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar vendas por período:', error)
      return { data: null, error }
    }
  }
}