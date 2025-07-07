import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Download, Upload, Edit, Trash2, 
  User, FileText, Clock, CheckCircle, XCircle, AlertCircle,
  Calendar, Phone, Mail, MapPin, Copy, Check, Loader, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { salesService, Sale, CreateSaleData } from '../../lib/sales';

const statusConfig = {
  'instalada': {
    label: 'Instalada',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle
  },
  'ag-instalacao': {
    label: 'Ag. Instalação',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: Clock
  },
  'reprovada': {
    label: 'Reprovada',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle
  }
};

export function SalesManagement() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Carregar vendas do usuário
  useEffect(() => {
    if (user) {
      loadSales();
    }
  }, [user]);

  const loadSales = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Primeiro verificar se o usuário tem acesso
      const { hasAccess, error: accessError } = await salesService.checkUserAccess(user.id);
      
      if (accessError) {
        console.warn('Erro ao verificar acesso, continuando...', accessError);
      }

      const { data, error } = await salesService.getUserSales(user.id);
      if (error) {
        console.error('Erro ao carregar vendas:', error);
        setError('Erro ao carregar vendas. Verifique sua conexão e tente novamente.');
      } else {
        setSales(data || []);
      }
    } catch (err) {
      console.error('Erro inesperado ao carregar vendas:', err);
      setError('Erro inesperado ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleStatusChange = async (saleId: string, newStatus: Sale['status']) => {
    try {
      const { data, error } = await salesService.updateSale({
        id: saleId,
        status: newStatus
      });
      
      if (error) {
        console.error('Erro ao atualizar status:', error);
        setError('Erro ao atualizar status: ' + (error.message || 'Erro desconhecido'));
      } else {
        setSales(prev => prev.map(sale => 
          sale.id === saleId ? { ...sale, status: newStatus } : sale
        ));
      }
    } catch (err) {
      console.error('Erro inesperado ao atualizar status:', err);
      setError('Erro inesperado ao atualizar status');
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return;
    
    try {
      const { error } = await salesService.deleteSale(saleId);
      if (error) {
        console.error('Erro ao excluir venda:', error);
        setError('Erro ao excluir venda: ' + (error.message || 'Erro desconhecido'));
      } else {
        setSales(prev => prev.filter(sale => sale.id !== saleId));
      }
    } catch (err) {
      console.error('Erro inesperado ao excluir venda:', err);
      setError('Erro inesperado ao excluir venda');
    }
  };

  const handleSaveSale = async (saleData: CreateSaleData) => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      if (editingSale) {
        // Atualizar venda existente
        const { data, error } = await salesService.updateSale({
          id: editingSale.id,
          ...saleData
        });
        
        if (error) {
          console.error('Erro ao atualizar venda:', error);
          setError('Erro ao atualizar venda: ' + (error.message || 'Erro desconhecido'));
        } else if (data) {
          setSales(prev => prev.map(sale => 
            sale.id === editingSale.id ? data : sale
          ));
          setEditingSale(null);
        }
      } else {
        // Criar nova venda
        const { data, error } = await salesService.createSale(user.id, saleData);
        
        if (error) {
          console.error('Erro ao criar venda:', error);
          setError('Erro ao criar venda: ' + (error.message || 'Erro desconhecido'));
        } else if (data) {
          setSales(prev => [data, ...prev]);
          setShowAddModal(false);
        }
      }
    } catch (err) {
      console.error('Erro inesperado ao salvar venda:', err);
      setError('Erro inesperado ao salvar venda');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-gray-300">Carregando vendas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2 sm:mb-4">
              Gerenciamento de Vendas
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
              Controle completo das suas vendas realizadas e status de instalação
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            <Plus size={20} />
            <span className="font-medium">Nova Venda</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <span className="text-red-100 flex-1 text-sm sm:text-base">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 touch-target"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Total de Vendas</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{sales.length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg">
              <FileText className="w-4 h-4 sm:w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Instaladas</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">
                {sales.filter(s => s.status === 'instalada').length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 sm:w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Ag. Instalação</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400">
                {sales.filter(s => s.status === 'ag-instalacao').length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-4 h-4 sm:w-5 h-5 lg:w-6 lg:h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Reprovadas</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400">
                {sales.filter(s => s.status === 'reprovada').length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-red-500/20 rounded-lg">
              <XCircle className="w-4 h-4 sm:w-5 h-5 lg:w-6 lg:h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome do cliente ou número do contrato..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
            >
              <option value="all">Todos os Status</option>
              <option value="instalada">Instalada</option>
              <option value="ag-instalacao">Ag. Instalação</option>
              <option value="reprovada">Reprovada</option>
            </select>
            
            <button 
              onClick={loadSales}
              disabled={loading}
              className="px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all disabled:opacity-50 touch-target"
              title="Recarregar vendas"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table - Desktop */}
      <div className="hidden lg:block bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Cliente</th>
                <th className="text-left p-4 text-gray-300 font-medium">Contrato</th>
                <th className="text-left p-4 text-gray-300 font-medium">Plano</th>
                <th className="text-left p-4 text-gray-300 font-medium">Valor</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Data</th>
                <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => {
                const statusInfo = statusConfig[sale.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {sale.client_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{sale.client_name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Phone size={12} />
                            <span>{sale.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono">{sale.contract_number}</span>
                        <button
                          onClick={() => handleCopy(sale.contract_number, sale.id)}
                          className="p-1 hover:bg-white/10 rounded transition-all"
                        >
                          {copied === sale.id ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        {sale.plan}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <span className="text-white font-semibold">
                        R$ {sale.value.toFixed(2)}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <select
                        value={sale.status}
                        onChange={(e) => handleStatusChange(sale.id, e.target.value as Sale['status'])}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium ${statusInfo.color} bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      >
                        <option value="ag-instalacao" className="bg-slate-800 text-yellow-400">Ag. Instalação</option>
                        <option value="instalada" className="bg-slate-800 text-green-400">Instalada</option>
                        <option value="reprovada" className="bg-slate-800 text-red-400">Reprovada</option>
                      </select>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-white">
                          {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        {sale.installation_date && (
                          <p className="text-gray-400 text-xs">
                            Inst: {new Date(sale.installation_date).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingSale(sale)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSale(sale.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredSales.map((sale) => {
          const statusInfo = statusConfig[sale.status];
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={sale.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {sale.client_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">{sale.client_name}</p>
                    <p className="text-gray-400 text-xs sm:text-sm font-mono">{sale.contract_number}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(sale.contract_number, sale.id)}
                  className="p-2 hover:bg-white/10 rounded transition-all touch-target"
                >
                  {copied === sale.id ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-gray-400 text-xs">Plano</p>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    {sale.plan}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Valor</p>
                  <p className="text-white font-semibold text-sm">R$ {sale.value.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Phone size={14} className="text-gray-400" />
                <span className="text-gray-300 text-sm">{sale.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <select
                  value={sale.status}
                  onChange={(e) => handleStatusChange(sale.id, e.target.value as Sale['status'])}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium ${statusInfo.color} bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500`}
                >
                  <option value="ag-instalacao" className="bg-slate-800 text-yellow-400">Ag. Instalação</option>
                  <option value="instalada" className="bg-slate-800 text-green-400">Instalada</option>
                  <option value="reprovada" className="bg-slate-800 text-red-400">Reprovada</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingSale(sale)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all touch-target"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSale(sale.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all touch-target"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  Criado em: {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                  {sale.installation_date && (
                    <span className="ml-2">
                      • Instalação: {new Date(sale.installation_date).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
        
      {filteredSales.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma venda encontrada</h3>
          <p className="text-gray-500 text-sm sm:text-base">
            {searchTerm || statusFilter !== 'all' 
              ? 'Tente ajustar sua busca ou filtros' 
              : 'Adicione sua primeira venda clicando no botão "Nova Venda"'
            }
          </p>
        </div>
      )}

      {/* Add/Edit Sale Modal */}
      {(showAddModal || editingSale) && (
        <SaleModal
          sale={editingSale}
          isOpen={showAddModal || !!editingSale}
          onClose={() => {
            setShowAddModal(false);
            setEditingSale(null);
          }}
          onSave={handleSaveSale}
          saving={saving}
        />
      )}
    </div>
  );
}

// Modal Component for Add/Edit Sale
interface SaleModalProps {
  sale?: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (saleData: CreateSaleData) => void;
  saving?: boolean;
}

function SaleModal({ sale, isOpen, onClose, onSave, saving = false }: SaleModalProps) {
  const [formData, setFormData] = useState<CreateSaleData>({
    client_name: sale?.client_name || '',
    contract_number: sale?.contract_number || '',
    phone: sale?.phone || '',
    plan: sale?.plan || '600MB',
    value: sale?.value || 99.99,
    status: sale?.status || 'ag-instalacao',
    installation_date: sale?.installation_date || '',
    notes: sale?.notes || ''
  });

  // Carregar dados salvos do localStorage quando o modal abrir
  useEffect(() => {
    if (isOpen && !sale) {
      const savedData = localStorage.getItem('saleFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(prev => ({ ...prev, ...parsedData }));
        } catch (error) {
          console.error('Erro ao carregar dados salvos:', error);
        }
      }
    }
  }, [isOpen, sale]);

  // Salvar dados no localStorage sempre que o formulário mudar
  useEffect(() => {
    if (isOpen && !sale) {
      localStorage.setItem('saleFormData', JSON.stringify(formData));
    }
  }, [formData, isOpen, sale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    
    // Limpar dados salvos após salvar com sucesso
    if (!sale) {
      localStorage.removeItem('saleFormData');
    }
  };

  const handleClose = () => {
    // Não limpar dados salvos ao fechar, apenas ao cancelar explicitamente
    onClose();
  };

  const handleCancel = () => {
    if (!sale) {
      localStorage.removeItem('saleFormData');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {sale ? 'Editar Venda' : 'Nova Venda'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Cliente *
              </label>
              <input
                type="text"
                required
                value={formData.client_name}
                onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                className="form-control"
                placeholder="Nome completo do cliente"
                disabled={saving}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Número do Contrato
              </label>
              <input
                type="text"
                value={formData.contract_number}
                onChange={(e) => setFormData({...formData, contract_number: e.target.value})}
                className="form-control"
                placeholder="Será gerado automaticamente se vazio"
                disabled={saving}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-control"
                placeholder="(85) 99999-9999"
                disabled={saving}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plano *
              </label>
              <select
                required
                value={formData.plan}
                onChange={(e) => setFormData({...formData, plan: e.target.value})}
                className="form-control"
                disabled={saving}
              >
                <option value="400MB">400MB - R$ 79,99</option>
                <option value="600MB">600MB - R$ 99,99</option>
                <option value="800MB">800MB - R$ 119,99</option>
                <option value="920MB">920MB - R$ 139,99</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                className="form-control"
                disabled={saving}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as Sale['status']})}
                className="form-control"
                disabled={saving}
              >
                <option value="ag-instalacao">Ag. Instalação</option>
                <option value="instalada">Instalada</option>
                <option value="reprovada">Reprovada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de Instalação
              </label>
              <input
                type="date"
                value={formData.installation_date}
                onChange={(e) => setFormData({...formData, installation_date: e.target.value})}
                className="form-control"
                disabled={saving}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="form-control"
              placeholder="Observações adicionais sobre a venda..."
              disabled={saving}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 touch-target"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 touch-target"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  {sale ? 'Atualizar' : 'Salvar'} Venda
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}