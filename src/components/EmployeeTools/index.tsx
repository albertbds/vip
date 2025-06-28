import React, { useState } from 'react';
import { 
  Calculator, FileText, Users, Clock, MapPin, Phone, Mail, 
  Clipboard, QrCode, Wifi, DollarSign, Calendar, Target,
  Copy, Check, Search, Download, Upload, Zap, Settings
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  color: string;
}

const tools: Tool[] = [
  {
    id: 'calculator',
    name: 'Calculadora de Planos',
    description: 'Calcule valores, descontos e promoções rapidamente',
    icon: Calculator,
    category: 'Vendas',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'contract-generator',
    name: 'Gerador de Contratos',
    description: 'Gere contratos personalizados automaticamente',
    icon: FileText,
    category: 'Documentos',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'customer-search',
    name: 'Busca de Clientes',
    description: 'Encontre informações de clientes rapidamente',
    icon: Users,
    category: 'Atendimento',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'schedule-manager',
    name: 'Agenda de Instalações',
    description: 'Gerencie agendamentos e instalações',
    icon: Calendar,
    category: 'Operações',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'coverage-checker',
    name: 'Verificador de Cobertura',
    description: 'Verifique disponibilidade por CEP ou endereço',
    icon: MapPin,
    category: 'Técnico',
    color: 'from-teal-500 to-green-500'
  },
  {
    id: 'speed-test',
    name: 'Teste de Velocidade',
    description: 'Realize testes de velocidade para clientes',
    icon: Zap,
    category: 'Técnico',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'qr-generator',
    name: 'Gerador de QR Code',
    description: 'Gere QR codes para WiFi e informações',
    icon: QrCode,
    category: 'Utilitários',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'commission-calc',
    name: 'Calculadora de Comissão',
    description: 'Calcule comissões e metas de vendas',
    icon: DollarSign,
    category: 'Vendas',
    color: 'from-pink-500 to-rose-500'
  }
];

export function EmployeeTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(tools.map(tool => tool.category)))];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderToolContent = (toolId: string) => {
    switch (toolId) {
      case 'calculator':
        return <PlanCalculator />;
      case 'contract-generator':
        return <ContractGenerator />;
      case 'customer-search':
        return <CustomerSearch />;
      case 'schedule-manager':
        return <ScheduleManager />;
      case 'coverage-checker':
        return <CoverageChecker />;
      case 'speed-test':
        return <SpeedTest />;
      case 'qr-generator':
        return <QRGenerator />;
      case 'commission-calc':
        return <CommissionCalculator />;
      default:
        return <div className="text-center text-gray-400">Ferramenta em desenvolvimento</div>;
    }
  };

  if (selectedTool) {
    const tool = tools.find(t => t.id === selectedTool);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedTool(null)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            ←
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">{tool?.name}</h2>
            <p className="text-gray-400">{tool?.description}</p>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          {renderToolContent(selectedTool)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
          Ferramentas do Funcionário
        </h2>
        <p className="text-gray-300 text-lg">
          Conjunto completo de ferramentas para otimizar seu trabalho diário
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ferramentas..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className="group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all transform hover:scale-105"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
              {tool.name}
            </h3>
            
            <p className="text-gray-400 text-sm mb-3">
              {tool.description}
            </p>
            
            <span className={`inline-block px-3 py-1 rounded-full text-xs bg-gradient-to-r ${tool.color} text-white`}>
              {tool.category}
            </span>
          </button>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma ferramenta encontrada</h3>
          <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
        </div>
      )}
    </div>
  );
}

// Componentes das ferramentas individuais
function PlanCalculator() {
  const [plan, setPlan] = useState({ speed: '600', price: 99.99, discount: 0 });
  const [copied, setCopied] = useState(false);

  const finalPrice = plan.price - (plan.price * plan.discount / 100);

  const handleCopy = async () => {
    const text = `Plano ${plan.speed}MB - R$ ${finalPrice.toFixed(2)}/mês`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Calculadora de Planos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Velocidade</label>
          <select
            value={plan.speed}
            onChange={(e) => setPlan({...plan, speed: e.target.value})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="400">400MB</option>
            <option value="600">600MB</option>
            <option value="800">800MB</option>
            <option value="920">920MB</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Preço Base</label>
          <input
            type="number"
            value={plan.price}
            onChange={(e) => setPlan({...plan, price: parseFloat(e.target.value)})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Desconto (%)</label>
          <input
            type="number"
            value={plan.discount}
            onChange={(e) => setPlan({...plan, discount: parseFloat(e.target.value)})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white">Plano {plan.speed}MB</h4>
            <p className="text-2xl font-bold text-blue-400">R$ {finalPrice.toFixed(2)}/mês</p>
            {plan.discount > 0 && (
              <p className="text-sm text-gray-400">
                Desconto de {plan.discount}% aplicado
              </p>
            )}
          </div>
          <button
            onClick={handleCopy}
            className={`p-3 rounded-lg transition-all ${
              copied ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContractGenerator() {
  const [clientData, setClientData] = useState({
    name: '',
    cpf: '',
    address: '',
    plan: '600MB'
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Gerador de Contratos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Nome do Cliente</label>
          <input
            type="text"
            value={clientData.name}
            onChange={(e) => setClientData({...clientData, name: e.target.value})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="Nome completo"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">CPF</label>
          <input
            type="text"
            value={clientData.cpf}
            onChange={(e) => setClientData({...clientData, cpf: e.target.value})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="000.000.000-00"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">Endereço</label>
          <input
            type="text"
            value={clientData.address}
            onChange={(e) => setClientData({...clientData, address: e.target.value})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="Endereço completo"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Plano</label>
          <select
            value={clientData.plan}
            onChange={(e) => setClientData({...clientData, plan: e.target.value})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="400MB">400MB</option>
            <option value="600MB">600MB</option>
            <option value="800MB">800MB</option>
            <option value="920MB">920MB</option>
          </select>
        </div>
      </div>
      
      <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">
        <div className="flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Gerar Contrato PDF
        </div>
      </button>
    </div>
  );
}

function CustomerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Busca de Clientes</h3>
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, CPF, telefone ou endereço..."
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
        />
      </div>
      
      <div className="text-center py-8 text-gray-400">
        <Users className="w-16 h-16 mx-auto mb-4" />
        <p>Digite para buscar clientes no sistema</p>
      </div>
    </div>
  );
}

function ScheduleManager() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Agenda de Instalações</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Agendamentos de Hoje</h4>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">Cliente {i}</p>
                    <p className="text-gray-400 text-sm">14:00 - Instalação 600MB</p>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    Agendado
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Novo Agendamento</h4>
          <div className="space-y-3">
            <input
              type="date"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            <input
              type="time"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Nome do cliente"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
            />
            <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all">
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverageChecker() {
  const [cep, setCep] = useState('');
  const [result, setResult] = useState<string | null>(null);
  
  const checkCoverage = () => {
    // Simulação de verificação
    setResult(Math.random() > 0.3 ? 'available' : 'unavailable');
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Verificador de Cobertura</h3>
      
      <div className="flex gap-4">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite o CEP"
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
        />
        <button
          onClick={checkCoverage}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
        >
          Verificar
        </button>
      </div>
      
      {result && (
        <div className={`p-4 rounded-lg border ${
          result === 'available' 
            ? 'bg-green-500/20 border-green-500/50 text-green-400'
            : 'bg-red-500/20 border-red-500/50 text-red-400'
        }`}>
          {result === 'available' 
            ? '✅ Cobertura disponível nesta região!'
            : '❌ Cobertura não disponível nesta região.'
          }
        </div>
      )}
    </div>
  );
}

function SpeedTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{download: number, upload: number} | null>(null);
  
  const runTest = async () => {
    setTesting(true);
    // Simulação de teste
    await new Promise(resolve => setTimeout(resolve, 3000));
    setResult({
      download: Math.floor(Math.random() * 500) + 100,
      upload: Math.floor(Math.random() * 200) + 50
    });
    setTesting(false);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Teste de Velocidade</h3>
      
      <div className="text-center">
        <button
          onClick={runTest}
          disabled={testing}
          className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all disabled:opacity-50"
        >
          {testing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Testando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Iniciar Teste
            </div>
          )}
        </button>
        
        {result && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Download</p>
              <p className="text-2xl font-bold text-green-400">{result.download} Mbps</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Upload</p>
              <p className="text-2xl font-bold text-blue-400">{result.upload} Mbps</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QRGenerator() {
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    security: 'WPA'
  });
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Gerador de QR Code WiFi</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Rede (SSID)</label>
            <input
              type="text"
              value={wifiData.ssid}
              onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Nome da rede WiFi"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
            <input
              type="text"
              value={wifiData.password}
              onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Senha da rede"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Segurança</label>
            <select
              value={wifiData.security}
              onChange={(e) => setWifiData({...wifiData, security: e.target.value})}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Sem senha</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-48 h-48 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
            <QrCode className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      </div>
      
      <button className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
        Gerar QR Code
      </button>
    </div>
  );
}

function CommissionCalculator() {
  const [sales, setSales] = useState({ amount: 0, commission: 5 });
  const commission = (sales.amount * sales.commission) / 100;
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Calculadora de Comissão</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Valor da Venda (R$)</label>
          <input
            type="number"
            value={sales.amount}
            onChange={(e) => setSales({...sales, amount: parseFloat(e.target.value) || 0})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Comissão (%)</label>
          <input
            type="number"
            value={sales.commission}
            onChange={(e) => setSales({...sales, commission: parseFloat(e.target.value) || 0})}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            placeholder="5"
          />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-lg p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-2">Comissão Calculada</h4>
        <p className="text-3xl font-bold text-pink-400">R$ {commission.toFixed(2)}</p>
        <p className="text-gray-400 text-sm mt-2">
          {sales.commission}% de R$ {sales.amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}