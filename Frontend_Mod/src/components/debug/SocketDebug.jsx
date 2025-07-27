import React, { useState, useEffect } from 'react';
import socketService from '../../services/socketService';
import { useAuth } from '../../context/AuthContext';

const SocketDebug = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Check connection status every second
    const interval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addMessage = (message) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = () => {
    if (user) {
      addMessage('Testing connection...');
      socketService.connect(user._id);
    } else {
      addMessage('No user logged in');
    }
  };

  const testEmit = () => {
    socketService.emit('test-event', { message: 'Hello from frontend!' });
    addMessage('Sent test event');
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">🔧 Socket Debug Panel</h3>
      
      <div className="mb-4">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </div>
      </div>

      <div className="space-x-2 mb-4">
        <button 
          onClick={testConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Connection
        </button>
        <button 
          onClick={testEmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!isConnected}
        >
          Test Emit
        </button>
        <button 
          onClick={() => setMessages([])}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Messages
        </button>
      </div>

      <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-64 overflow-y-auto">
        <div className="mb-2 text-yellow-400">📋 Debug Messages:</div>
        {messages.length === 0 ? (
          <div className="text-gray-500">No messages yet...</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocketDebug;
