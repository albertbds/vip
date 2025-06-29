import React, { useState } from 'react';
import { 
  Bell, X, Check, CheckCheck, Trash2, Settings, 
  Info, AlertTriangle, CheckCircle, XCircle, Download,
  Clock, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, Notification } from '../../contexts/NotificationContext';

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />;
      case 'update':
        return <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'update':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.action?.onClick) {
      notification.action.onClick();
    } else if (notification.action?.url) {
      window.open(notification.action.url, '_blank');
    }
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all touch-target"
      >
        <Bell size={18} className="sm:w-5 sm:h-5 text-gray-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50 max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 sm:p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">Notificações</h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-all touch-target"
                        title="Marcar todas como lidas"
                      >
                        <CheckCheck size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-all touch-target"
                    >
                      <X size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center">
                    <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-400 text-sm sm:text-base">Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all hover:bg-white/5 group ${
                          getNotificationColor(notification.type)
                        } ${!notification.read ? 'ring-1 ring-blue-500/30' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-xs sm:text-sm font-medium ${
                                notification.read ? 'text-gray-300' : 'text-white'
                              }`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-all touch-target"
                                >
                                  <X size={10} className="sm:w-3 sm:h-3 text-gray-400" />
                                </button>
                              </div>
                            </div>
                            
                            <p className={`text-xs mt-1 ${
                              notification.read ? 'text-gray-400' : 'text-gray-300'
                            }`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={8} className="sm:w-2.5 sm:h-2.5" />
                                {formatTime(notification.timestamp)}
                              </div>
                              
                              {notification.action && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationClick(notification);
                                  }}
                                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 touch-target"
                                >
                                  {notification.action.label}
                                  {notification.action.url && <ExternalLink size={8} className="sm:w-2.5 sm:h-2.5" />}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={clearAll}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 touch-target"
                    >
                      <Trash2 size={10} className="sm:w-3 sm:h-3" />
                      Limpar todas
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1 touch-target"
                    >
                      <Settings size={10} className="sm:w-3 sm:h-3" />
                      Configurações
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}