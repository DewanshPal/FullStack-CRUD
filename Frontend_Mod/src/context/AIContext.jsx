import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { voiceService } from '../services/voiceService';
import { useTask } from './TaskContext';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AIContext = createContext();

const initialState = {
  isListening: false,
  isProcessing: false,
  chatHistory: [],
  lastCommand: null,
  smartSuggestions: [],
  voiceEnabled: false,
  chatEnabled: true,
  isAIThinking: false,
  pendingConfirmation: null,
  settings: {
    voiceAutoExecute: false,
    speechRate: 1,
    speechVolume: 0.8,
    autoSuggestions: true,
    confirmActions: true
  }
};

const aiReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LISTENING':
      return { ...state, isListening: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_AI_THINKING':
      return { ...state, isAIThinking: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };
    case 'SET_LAST_COMMAND':
      return { ...state, lastCommand: action.payload };
    case 'SET_SMART_SUGGESTIONS':
      return { ...state, smartSuggestions: action.payload };
    case 'SET_VOICE_ENABLED':
      return { ...state, voiceEnabled: action.payload };
    case 'SET_CHAT_ENABLED':
      return { ...state, chatEnabled: action.payload };
    case 'SET_PENDING_CONFIRMATION':
      return { ...state, pendingConfirmation: action.payload };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'CLEAR_CHAT_HISTORY':
      return { ...state, chatHistory: [] };
    default:
      return state;
  }
};

export const AIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(aiReducer, initialState);
  const { tasks, createTask, updateTask, deleteTask } = useTask();
  const { user } = useAuth();

  // Initialize voice service
  useEffect(() => {
    if (voiceService.isSpeechRecognitionSupported()) {
      voiceService.onStart = () => dispatch({ type: 'SET_LISTENING', payload: true });
      voiceService.onEnd = () => dispatch({ type: 'SET_LISTENING', payload: false });
      voiceService.onError = (error) => {
        dispatch({ type: 'SET_LISTENING', payload: false });
        toast.error(`Voice recognition error: ${error}`);
      };
      voiceService.onResult = handleVoiceResult;
    } else {
      console.warn('Speech recognition not supported');
    }
  }, []);

  // Generate smart suggestions periodically
  useEffect(() => {
    if (state.settings.autoSuggestions && tasks.length > 0) {
      generateSmartSuggestions();
    }
  }, [tasks, state.settings.autoSuggestions]);

  const handleVoiceResult = async (transcript) => {
    console.log('Voice input received:', transcript);
    
    addChatMessage({
      type: 'user',
      content: transcript,
      timestamp: new Date(),
      isVoice: true
    });

    // Parse voice command
    const parsedCommand = voiceService.parseVoiceCommand(transcript);
    dispatch({ type: 'SET_LAST_COMMAND', payload: parsedCommand });

    if (parsedCommand.action === 'ai_process') {
      await processAICommand(transcript);
    } else {
      await executeVoiceCommand(parsedCommand);
    }
  };

  const executeVoiceCommand = async (parsedCommand) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });

    try {
      const taskOperation = voiceService.voiceCommandToTask(parsedCommand);
      
      switch (taskOperation.operation) {
        case 'create':
          if (state.settings.confirmActions) {
            setPendingConfirmation({
              type: 'create',
              data: taskOperation.data,
              message: `Create task: "${taskOperation.data.title}"?`
            });
          } else {
            await createTask(taskOperation.data);
            speak(`Task "${taskOperation.data.title}" created successfully.`);
          }
          break;

        case 'filter':
          // Apply filters to task view
          addChatMessage({
            type: 'ai',
            content: `Showing ${taskOperation.data.status || 'all'} tasks`,
            timestamp: new Date()
          });
          break;

        case 'update':
          const taskToUpdate = findTaskByTitle(taskOperation.searchTitle);
          if (taskToUpdate) {
            if (state.settings.confirmActions) {
              setPendingConfirmation({
                type: 'update',
                taskId: taskToUpdate._id,
                data: taskOperation.data,
                message: `Update task "${taskToUpdate.title}"?`
              });
            } else {
              await updateTask(taskToUpdate._id, taskOperation.data);
              speak(`Task "${taskToUpdate.title}" updated successfully.`);
            }
          } else {
            speak(`Sorry, I couldn't find a task with that title.`);
          }
          break;

        case 'delete':
          const taskToDelete = findTaskByTitle(taskOperation.searchTitle);
          if (taskToDelete) {
            if (state.settings.confirmActions) {
              setPendingConfirmation({
                type: 'delete',
                taskId: taskToDelete._id,
                message: `Delete task "${taskToDelete.title}"?`
              });
            } else {
              await deleteTask(taskToDelete._id);
              speak(`Task "${taskToDelete.title}" deleted successfully.`);
            }
          } else {
            speak(`Sorry, I couldn't find a task with that title.`);
          }
          break;

        default:
          await processAICommand(parsedCommand.originalCommand);
      }
    } catch (error) {
      console.error('Voice command execution error:', error);
      toast.error('Failed to execute voice command');
      speak('Sorry, I encountered an error executing your command.');
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const processAICommand = async (userInput) => {
    dispatch({ type: 'SET_AI_THINKING', payload: true });

    try {
      const aiResponse = await aiService.processCommand(userInput, tasks);
      
      addChatMessage({
        type: 'ai',
        content: aiResponse.message,
        timestamp: new Date(),
        action: aiResponse.action,
        parameters: aiResponse.parameters
      });

      if (aiResponse.confirmation_needed) {
        setPendingConfirmation({
          type: aiResponse.action,
          data: aiResponse.parameters,
          message: aiResponse.message,
          aiResponse
        });
      } else if (aiResponse.action !== 'chat' && aiResponse.action !== 'error') {
        await executeAIAction(aiResponse);
      }

      // Speak AI response if voice is enabled
      if (state.voiceEnabled) {
        speak(aiResponse.message);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process AI command');
      
      addChatMessage({
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        isError: true
      });
    } finally {
      dispatch({ type: 'SET_AI_THINKING', payload: false });
    }
  };

  const executeAIAction = async (aiResponse) => {
    try {
      const result = await aiService.executeTaskOperation(aiResponse, tasks);
      
      if (result.success) {
        addChatMessage({
          type: 'ai',
          content: 'Action completed successfully!',
          timestamp: new Date(),
          isSuccess: true
        });
      } else {
        addChatMessage({
          type: 'ai',
          content: result.message || 'Action failed',
          timestamp: new Date(),
          isError: true
        });
      }
    } catch (error) {
      console.error('AI action execution error:', error);
      addChatMessage({
        type: 'ai',
        content: 'Failed to execute the requested action.',
        timestamp: new Date(),
        isError: true
      });
    }
  };

  const confirmPendingAction = async () => {
    if (!state.pendingConfirmation) return;

    const { type, data, taskId, aiResponse } = state.pendingConfirmation;

    try {
      switch (type) {
        case 'create':
          await createTask(data);
          toast.success('Task created successfully!');
          speak('Task created successfully.');
          break;

        case 'update':
          await updateTask(taskId, data);
          toast.success('Task updated successfully!');
          speak('Task updated successfully.');
          break;

        case 'delete':
          await deleteTask(taskId);
          toast.success('Task deleted successfully!');
          speak('Task deleted successfully.');
          break;

        default:
          if (aiResponse) {
            await executeAIAction(aiResponse);
          }
      }
    } catch (error) {
      console.error('Confirmation action error:', error);
      toast.error('Failed to execute action');
      speak('Failed to execute action.');
    } finally {
      dispatch({ type: 'SET_PENDING_CONFIRMATION', payload: null });
    }
  };

  const cancelPendingAction = () => {
    dispatch({ type: 'SET_PENDING_CONFIRMATION', payload: null });
    speak('Action cancelled.');
  };

  const setPendingConfirmation = (confirmation) => {
    dispatch({ type: 'SET_PENDING_CONFIRMATION', payload: confirmation });
  };

  const addChatMessage = (message) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
  };

  const startVoiceListening = () => {
    if (!voiceService.isSpeechRecognitionSupported()) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    try {
      voiceService.startListening();
    } catch (error) {
      console.error('Failed to start voice listening:', error);
      toast.error('Failed to start voice recognition');
    }
  };

  const stopVoiceListening = () => {
    voiceService.stopListening();
  };

  const speak = (text, options = {}) => {
    if (state.voiceEnabled && voiceService.isSpeechSynthesisSupported()) {
      voiceService.speak(text, {
        rate: state.settings.speechRate,
        volume: state.settings.speechVolume,
        ...options
      });
    }
  };

  const sendChatMessage = async (message) => {
    addChatMessage({
      type: 'user',
      content: message,
      timestamp: new Date()
    });

    await processAICommand(message);
  };

  const generateSmartSuggestions = async () => {
    try {
      const suggestions = await aiService.getSmartSuggestions(tasks);
      dispatch({ type: 'SET_SMART_SUGGESTIONS', payload: suggestions });
    } catch (error) {
      console.error('Failed to generate smart suggestions:', error);
    }
  };

  const findTaskByTitle = (searchTitle) => {
    return tasks.find(task => 
      task.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
  };

  const toggleVoice = () => {
    const newVoiceEnabled = !state.voiceEnabled;
    dispatch({ type: 'SET_VOICE_ENABLED', payload: newVoiceEnabled });
    
    if (newVoiceEnabled) {
      speak('Voice assistant enabled');
    }
  };

  const toggleChat = () => {
    dispatch({ type: 'SET_CHAT_ENABLED', payload: !state.chatEnabled });
  };

  const clearChatHistory = () => {
    dispatch({ type: 'CLEAR_CHAT_HISTORY' });
  };

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  const value = {
    ...state,
    startVoiceListening,
    stopVoiceListening,
    sendChatMessage,
    speak,
    confirmPendingAction,
    cancelPendingAction,
    generateSmartSuggestions,
    toggleVoice,
    toggleChat,
    clearChatHistory,
    updateSettings,
    addChatMessage,
    isVoiceSupported: voiceService.isSpeechRecognitionSupported(),
    isSpeechSynthesisSupported: voiceService.isSpeechSynthesisSupported()
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
