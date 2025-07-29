import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX,
  Trash2,
  Settings,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { formatDate } from '../../utils/dateUtils';

const AIChat = ({ isOpen, onToggle }) => {
  const {
    chatHistory,
    isListening,
    isProcessing,
    isAIThinking,
    voiceEnabled,
    pendingConfirmation,
    smartSuggestions,
    startVoiceListening,
    stopVoiceListening,
    sendChatMessage,
    confirmPendingAction,
    cancelPendingAction,
    toggleVoice,
    clearChatHistory,
    isVoiceSupported,
    isSpeechSynthesisSupported
  } = useAI();

  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAIThinking]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await sendChatMessage(message);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    await sendChatMessage(suggestion.title);
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'ai':
        return <Bot className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getMessageBgColor = (message) => {
    if (message.isError) return 'bg-red-50 border-red-200';
    if (message.isSuccess) return 'bg-green-50 border-green-200';
    if (message.type === 'user') return 'bg-primary-50 border-primary-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getMessageTextColor = (message) => {
    if (message.isError) return 'text-red-700';
    if (message.isSuccess) return 'text-green-700';
    if (message.type === 'user') return 'text-primary-700';
    return 'text-gray-700';
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
        title="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
          {isAIThinking && (
            <Loader className="h-4 w-4 text-primary-600 animate-spin" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isSpeechSynthesisSupported && (
            <button
              onClick={toggleVoice}
              className={`p-1 rounded ${
                voiceEnabled 
                  ? 'text-primary-600 hover:text-primary-700' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title={`${voiceEnabled ? 'Disable' : 'Enable'} voice responses`}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={clearChatHistory}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && !showSettings && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">Smart Suggestions:</p>
          <div className="space-y-1">
            {smartSuggestions.slice(0, 2).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left text-xs p-2 bg-white dark:bg-gray-700 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                <span className="font-medium text-blue-600 dark:text-blue-400">{suggestion.title}</span>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{suggestion.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">AI Settings</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Voice Responses</span>
              <button
                onClick={toggleVoice}
                className={`w-10 h-6 rounded-full transition-colors ${
                  voiceEnabled ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  voiceEnabled ? 'translate-x-5' : 'translate-x-1'
                } mt-1`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Confirmation */}
      {pendingConfirmation && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
            {pendingConfirmation.message}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={confirmPendingAction}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Confirm</span>
            </button>
            <button
              onClick={cancelPendingAction}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              <XCircle className="h-3 w-3" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Hi! I'm your AI assistant.</p>
            <p className="text-xs mt-1">Ask me to create, update, or manage your tasks!</p>
          </div>
        )}
        
        {chatHistory.map((message, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div className={`p-2 rounded-full ${
              message.type === 'user' ? 'bg-primary-100' : 'bg-gray-100'
            }`}>
              {getMessageIcon(message.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`p-3 rounded-lg border ${getMessageBgColor(message)}`}>
                <p className={`text-sm ${getMessageTextColor(message)}`}>
                  {message.content}
                </p>
                {message.isVoice && (
                  <span className="inline-flex items-center mt-1 text-xs text-gray-500">
                    <Mic className="h-3 w-3 mr-1" />
                    Voice input
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isAIThinking && (
          <div className="flex items-start space-x-2">
            <div className="p-2 rounded-full bg-gray-100">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin text-primary-600" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your tasks..."
            className="flex-1 input text-sm"
            disabled={isProcessing}
          />
          
          {isVoiceSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          
          <button
            type="submit"
            disabled={!inputMessage.trim() || isProcessing}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        
        {isListening && (
          <div className="mt-2 flex items-center justify-center text-sm text-red-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span>Listening...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;
