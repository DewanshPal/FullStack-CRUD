import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { voiceService } from '../../services/voiceService';

const VoiceIndicator = () => {
  const {
    isListening,
    isProcessing,
    voiceEnabled,
    startVoiceListening,
    stopVoiceListening,
    toggleVoice,
    isVoiceSupported
  } = useAI();

  const [microphoneStatus, setMicrophoneStatus] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkMicrophoneStatus();
  }, []);

  const checkMicrophoneStatus = async () => {
    try {
      const status = await voiceService.checkMicrophoneAccess();
      setMicrophoneStatus(status);
    } catch (error) {
      console.error('Error checking microphone status:', error);
      setMicrophoneStatus({ available: false, error: error.message });
    }
  };

  const handleVoiceToggle = async () => {
    if (isListening) {
      stopVoiceListening();
      return;
    }

    // Check microphone access before starting
    if (!microphoneStatus?.available) {
      await checkMicrophoneStatus();
      if (!microphoneStatus?.available) {
        showErrorMessage(microphoneStatus?.error || 'Microphone access required');
        return;
      }
    }

    try {
      await startVoiceListening();
    } catch (error) {
      console.error('Voice listening error:', error);
      showErrorMessage(error.message || 'Failed to start voice recognition');
    }
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  if (!isVoiceSupported) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col items-end space-y-2">
      {/* Error Message */}
      {showError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      {/* Voice Status Indicator */}
      {(isListening || isProcessing) && (
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {isListening && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-600">Listening...</span>
            </>
          )}
          {isProcessing && !isListening && (
            <>
              <Loader className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-blue-600">Processing...</span>
            </>
          )}
        </div>
      )}

      {/* Voice Control Buttons */}
      <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Microphone Status Indicator */}
        <div className="px-2">
          {microphoneStatus?.available ? (
            <CheckCircle className="h-3 w-3 text-green-500" title="Microphone available" />
          ) : (
            <AlertCircle className="h-3 w-3 text-red-500" title={microphoneStatus?.error || "Microphone not available"} />
          )}
        </div>

        {/* Voice Response Toggle */}
        <button
          onClick={toggleVoice}
          className={`p-2 rounded-md transition-colors ${
            voiceEnabled
              ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title={`${voiceEnabled ? 'Disable' : 'Enable'} voice responses`}
        >
          <Volume2 className="h-4 w-4" />
        </button>

        {/* Voice Input Toggle */}
        <button
          onClick={handleVoiceToggle}
          disabled={isProcessing || !microphoneStatus?.available}
          className={`p-2 rounded-md transition-colors ${
            isListening
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : microphoneStatus?.available
              ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={
            !microphoneStatus?.available
              ? microphoneStatus?.error || 'Microphone not available'
              : isListening
              ? 'Stop listening'
              : 'Start voice input'
          }
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default VoiceIndicator;
