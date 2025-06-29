import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'update';
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar notificações do localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`notifications_${user.id}`);
      if (saved) {
        try {
          const parsedNotifications = JSON.parse(saved);
          setNotifications(parsedNotifications);
        } catch (error) {
          console.error('Erro ao carregar notificações:', error);
        }
      }
    }
  }, [user]);

  // Salvar notificações no localStorage
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Simular notificações de atualização do sistema
  useEffect(() => {
    if (!user) return;

    // Verificar se já foi mostrada a notificação de boas-vindas
    const hasWelcomeNotification = notifications.some(n => n.type === 'success' && n.title.includes('Bem-vindo'));
    
    if (!hasWelcomeNotification) {
      // Adicionar notificação de boas-vindas
      setTimeout(() => {
        addNotification({
          title: 'Bem-vindo ao Sistema!',
          message: 'Seu acesso foi configurado com sucesso. Explore todas as funcionalidades disponíveis.',
          type: 'success',
          action: {
            label: 'Explorar',
            onClick: () => {}
          }
        });
      }, 2000);
    }

    // Simular notificações de atualização do sistema periodicamente
    const updateInterval = setInterval(() => {
      const updateMessages = [
        {
          title: 'Nova Atualização Disponível',
          message: 'Sistema atualizado com melhorias de performance e correções de bugs.',
          type: 'update' as const
        },
        {
          title: 'Novos Planos Adicionados',
          message: 'Confira os novos planos de internet disponíveis em sua região.',
          type: 'info' as const
        },
        {
          title: 'Manutenção Programada',
          message: 'Manutenção do sistema programada para domingo às 02:00. Duração estimada: 30 minutos.',
          type: 'warning' as const
        },
        {
          title: 'Backup Realizado',
          message: 'Backup automático dos dados realizado com sucesso.',
          type: 'success' as const
        }
      ];

      const randomMessage = updateMessages[Math.floor(Math.random() * updateMessages.length)];
      
      // Verificar se já existe uma notificação similar recente (últimas 24h)
      const recentSimilar = notifications.some(n => 
        n.title === randomMessage.title && 
        Date.now() - new Date(n.timestamp).getTime() < 24 * 60 * 60 * 1000
      );

      if (!recentSimilar) {
        addNotification(randomMessage);
      }
    }, 5 * 60 * 1000); // A cada 5 minutos

    return () => clearInterval(updateInterval);
  }, [user, notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Manter apenas 50 notificações
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
}