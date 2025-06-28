import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, TrendingUp, Clock, MapPin, Phone, Wifi, 
  DollarSign, Target, Award, Calendar, Activity, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  totalClients: number;
  newClients: number;
  revenue: number;
  coverage: number;
  satisfaction: number;
  uptime: number;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'support' | 'installation' | 'maintenance';
  description: string;
  time: string;
  status: 'completed' | 'pending' | 'in-progress';
}

export function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 15420,
    newClients: 234,
    revenue: 1250000,
    coverage: 98.5,
    satisfaction: 4.8,
    uptime: 99.9
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'sale',
      description: 'Nova contratação - Plano 600MB em Fortaleza',
      time: '2 min atrás',
      status: 'completed'
    },
    {
      id: '2',
      type: 'support',
      description: 'Chamado técnico resolvido - Instabilidade de conexão',
      time: '15 min atrás',
      status: 'completed'
    },
    {
      id: '3',
      type: 'installation',
      description: 'Instalação agendada para amanhã - Bairro Aldeota',
      time: '1 hora atrás',
      status: 'pending'
    },
    {
      id: '4',
      type: 'maintenance',
      description: 'Manutenção preventiva em andamento - Setor 3',
      time: '2 horas atrás',
      status: 'in-progress'
    }
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <DollarSign size={16} className="text-green-400" />;
      case 'support': return <Phone size={16} className="text-blue-400" />;
      case 'installation': return <Wifi size={16} className="text-purple-400" />;
      case 'maintenance': return <Activity size={16} className="text-orange-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'in-progress': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-gray-300 text-lg">
              Aqui está um resumo das atividades de hoje
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Último acesso</p>
            <p className="text-white font-medium">
              {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+{stats.newClients} hoje</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {stats.totalClients.toLocaleString('pt-BR')}
          </h3>
          <p className="text-gray-400">Total de Clientes</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            R$ {(stats.revenue / 1000000).toFixed(1)}M
          </h3>
          <p className="text-gray-400">Receita Mensal</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+0.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.coverage}%</h3>
          <p className="text-gray-400">Cobertura</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+0.1</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.satisfaction}/5</h3>
          <p className="text-gray-400">Satisfação</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">Estável</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.uptime}%</h3>
          <p className="text-gray-400">Uptime</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+8.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">2.4k</h3>
          <p className="text-gray-400">Vendas/Mês</p>
        </div>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Atividades Recentes</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm">Ver todas</button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                <div className="p-2 bg-white/10 rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-xs">{activity.time}</span>
                    <span className={`text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status === 'completed' ? 'Concluído' :
                       activity.status === 'pending' ? 'Pendente' : 'Em andamento'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Ações Rápidas</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-lg border border-blue-500/30 hover:from-blue-600/30 hover:to-blue-500/30 transition-all group">
              <Users className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium text-sm">Novo Cliente</p>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-lg border border-green-500/30 hover:from-green-600/30 hover:to-green-500/30 transition-all group">
              <Phone className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium text-sm">Suporte</p>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-lg border border-purple-500/30 hover:from-purple-600/30 hover:to-purple-500/30 transition-all group">
              <Calendar className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium text-sm">Agendar</p>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-orange-600/20 to-orange-500/20 rounded-lg border border-orange-500/30 hover:from-orange-600/30 hover:to-orange-500/30 transition-all group">
              <BarChart3 className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-medium text-sm">Relatórios</p>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Performance Mensal</h3>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Gráfico de performance será exibido aqui</p>
            <p className="text-gray-500 text-sm mt-2">Integração com sistema de métricas em desenvolvimento</p>
          </div>
        </div>
      </div>
    </div>
  );
}