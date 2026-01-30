import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import Button from './Button';

const Toast: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.3 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`bg-white rounded-lg shadow-lg border-l-4 ${getBorderColor(notification.type)} p-4 max-w-sm w-full`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h4>
                <p className="mt-1 text-sm text-gray-700">
                  {notification.message}
                </p>
                {notification.action && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Button>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="!p-1"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;