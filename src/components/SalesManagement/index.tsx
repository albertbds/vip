import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Download, Upload, Edit, Trash2, 
  User, FileText, Clock, CheckCircle, XCircle, AlertCircle,
  Calendar, Phone, Mail, MapPin, Copy, Check
} from 'lucide-react';

interface Sale {
  id: string;
  clientName: string;
  contractNumber: string;
  phone: string;
  email: string;
  address: string;
  plan: string;
  value: number;
  status: 'instalada' | 'ag-instalacao' | 'reprovada';
  createdAt: string;
  installationDate?: string;
  notes?: string;
}

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
  const [sales, setSales] = useState<Sale[]>([
    {
      id: '1',
      clientName: 'João Silva Santos',
      contractNumber: 'CT-2025-001',
      phone: '(85) 99999-9999',
      email: 'joao.silva@email.com',
      address: 'Rua das Flores, 123 - Aldeota, Fortaleza - CE',
      plan: '600MB',
      value: 99.99,
      status: 'ag-instalacao',
      createdAt: '2025-01-28',
      installationDate: '2025-01-30',
      notes: 'Cliente preferiu instalação pela manhã'
    },
    {
      id: '2',
      clientName: 'Maria Oliveira Costa',
      contractNumber: 'CT-2025-002',
      phone: '(85) 98888-8888',
      email: 'maria.costa@email.com',
      address: 'Av. Beira Mar, 456 - Meireles, Fortaleza - CE',
      plan: '920MB',
      value: 139.99,
      status: 'instalada',
      createdAt: '2025-01-27',
      installationDate: '2025-01-28'
    },
    {
      id: '3',
      clientName: 'Pedro Almeida Lima',
      contractNumber: 'CT-2025-003',
      phone: '(85) 97777-7777',
      email: 'pedro.lima@email.com',
      address: 'Rua José Vilar, 789 - Cocó, Fortaleza - CE',
      plan: '400MB',
      value: 79.99,
      status: 'reprovada',
      createdAt: '2025-01-26',
      notes: 'Área sem cobertura'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.phone.includes(searchTerm) ||
      sale.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleStatusChange = (saleId: string, newStatus: Sale['status']) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId 
        ? { ...sale, status: newStatus }
        : sale
    ));
  };

  const handleDeleteSale = (saleId: string) => {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
      setSales(prev => prev.filter(sale => sale.id !== saleId));
    }
  };

  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const count = sales.length + 1;
    return `CT-${year}-${count.toString().padStart(3, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
              Gerenciamento de Vendas
            </h2>
            <p className="text-gray-300 text-lg">
              Controle completo das vendas realizadas e status de instalação
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
          >
            <Plus size={20} />
            Nova Venda
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Vendas</p>
              <p className="text-2xl font-bold text-white">{sales.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Instaladas</p>
              <p className="text-2xl font-bold text-green-400">
                {sales.filter(s => s.status === 'instalada').length}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ag. Instalação</p>
              <p className="text-2xl font-bold text-yellow-400">
                {sales.filter(s => s.status === 'ag-instalacao').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Reprovadas</p>
              <p className="text-2xl font-bold text-red-400">
                {sales.filter(s => s.status === 'reprovada').length}
              </p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome do cliente ou número do contrato..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos os Status</option>
              <option value="instalada">Instalada</option>
              <option value="ag-instalacao">Ag. Instalação</option>
              <option value="reprovada">Reprovada</option>
            </select>
            
            <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all">
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
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
                            {sale.clientName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{sale.clientName}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Phone size={12} />
                            <span>{sale.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono">{sale.contractNumber}</span>
                        <button
                          onClick={() => handleCopy(sale.contractNumber, sale.id)}
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
                          {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                        {sale.installationDate && (
                          <p className="text-gray-400 text-xs">
                            Inst: {new Date(sale.installationDate).toLocaleDateString('pt-BR')}
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
        
        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma venda encontrada</h3>
            <p className="text-gray-500">Tente ajustar sua busca ou adicione uma nova venda</p>
          </div>
        )}
      </div>

      {/* Add/Edit Sale Modal */}
      {(showAddModal || editingSale) && (
        <SaleModal
          sale={editingSale}
          isOpen={showAddModal || !!editingSale}
          onClose={() => {
            setShowAddModal(false);
            setEditingSale(null);
          }}
          onSave={(saleData) => {
            if (editingSale) {
              setSales(prev => prev.map(sale => 
                sale.id === editingSale.id ? { ...sale, ...saleData } : sale
              ));
            } else {
              const newSale: Sale = {
                id: Date.now().toString(),
                contractNumber: generateContractNumber(),
                createdAt: new Date().toISOString().split('T')[0],
                ...saleData
              };
              setSales(prev => [newSale, ...prev]);
            }
            setShowAddModal(false);
            setEditingSale(null);
          }}
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
  onSave: (saleData: Partial<Sale>) => void;
}

function SaleModal({ sale, isOpen, onClose, onSave }: SaleModalProps) {
  const [formData, setFormData] = useState({
    clientName: sale?.clientName || '',
    phone: sale?.phone || '',
    email: sale?.email || '',
    address: sale?.address || '',
    plan: sale?.plan || '600MB',
    value: sale?.value || 99.99,
    status: sale?.status || 'ag-instalacao' as Sale['status'],
    installationDate: sale?.installationDate || '',
    notes: sale?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">
            {sale ? 'Editar Venda' : 'Nova Venda'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Cliente *
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Nome completo do cliente"
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
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="(85) 99999-9999"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="cliente@email.com"
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
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ag-instalacao">Ag. Instalação</option>
                <option value="instalada">Instalada</option>
                <option value="reprovada">Reprovada</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Endereço Completo *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Rua, número, bairro, cidade - estado"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data de Instalação
            </label>
            <input
              type="date"
              value={formData.installationDate}
              onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Observações adicionais sobre a venda..."
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all"
            >
              {sale ? 'Atualizar' : 'Salvar'} Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}