import React, { createContext, useContext, useState, useCallback } from 'react';
import AnimatedNotification from '../components/common/AnimatedNotification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showNotification = useCallback(({ type, title, message, duration }) => {
    setNotification({
      show: true,
      type,
      title,
      message,
      duration,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  const notify = {
    success: (message, title = 'Success', duration) => 
      showNotification({ type: 'success', title, message, duration }),
    error: (message, title = 'Error', duration) => 
      showNotification({ type: 'error', title, message, duration }),
    info: (message, title = 'Info', duration) => 
      showNotification({ type: 'info', title, message, duration }),
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <AnimatedNotification
        show={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={hideNotification}
        duration={notification.duration}
      />
    </NotificationContext.Provider>
  );
};
