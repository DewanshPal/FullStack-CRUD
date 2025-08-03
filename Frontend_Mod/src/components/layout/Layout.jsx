import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AIChat from '../ai/AIChat';
import VoiceIndicator from '../ai/VoiceIndicator';
import { NotificationProvider } from '../../context/NotificationContext';

const Layout = ({ children }) => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="pt-20 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
          {children}
        </main>
        
        {/* AI Components */}
        <VoiceIndicator />
        <AIChat 
          isOpen={isAIChatOpen} 
          onToggle={() => setIsAIChatOpen(!isAIChatOpen)} 
        />
      </div>
    </NotificationProvider>
  );
};

export default Layout;