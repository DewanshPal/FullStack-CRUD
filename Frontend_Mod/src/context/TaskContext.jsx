import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';
import socketService from '../services/socketService';
import toast from 'react-hot-toast';

// Helper function to calculate stats from tasks array
const calculateStatsFromTasks = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      overdue: 0
    };
  }

  const now = new Date();
  const stats = {
    total: tasks.length,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0
  };

  tasks.forEach(task => {
    // Handle status counting
    const status = task.status?.toLowerCase();
    switch (status) {
      case 'completed':
        stats.completed++;
        break;
      case 'in-progress':
        stats.inProgress++;
        break;
      case 'pending':
        stats.pending++;
        break;
      default:
        console.warn('Unknown task status:', task.status, 'for task:', task._id);
        stats.pending++; // Default unknown status to pending
        break;
    }

    // Check if task is overdue (not completed and due date has passed)
    if (status !== 'completed' && task.dueDate) {
      try {
        const dueDate = new Date(task.dueDate);
        if (!isNaN(dueDate.getTime()) && dueDate < now) {
          stats.overdue++;
        }
      } catch (error) {
        console.warn('Invalid due date for task:', task._id, task.dueDate);
      }
    }
  });

  console.log('📊 Calculated stats:', stats);
  return stats;
};
import { logActivity } from '../../../Backend/src/controllers/activity.controller';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  taskStats: null,
  upcomingTasks: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
  },
};

const taskReducer = (state, action) => {
  // Debug logging
  console.log('TaskReducer:', action.type);
  console.log('Payload:', action.payload);
  console.log('Payload type:', typeof action.payload);
  console.log('Payload._id:', action.payload?._id);
  
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TASKS':
      const newState = { ...state, tasks: action.payload, loading: false };
      // Calculate stats locally for immediate update
      newState.taskStats = calculateStatsFromTasks(action.payload);
      return newState;
    case 'SET_TASK_STATS':
      return { ...state, taskStats: action.payload };
    case 'SET_UPCOMING_TASKS':
      return { ...state, upcomingTasks: action.payload };
    case 'ADD_TASK':
      console.log('Adding task:', action.payload);
      console.log('Current tasks count:', state.tasks.length);
      
      // Check if task already exists to prevent duplicates
      const taskExists = state.tasks.some(task => task._id === action.payload._id);
      if (taskExists) {
        console.log('Task already exists, skipping duplicate:', action.payload._id);
        return state;
      }
      
      const updatedTasksAdd = [action.payload, ...state.tasks];
      return { 
        ...state, 
        tasks: updatedTasksAdd,
        taskStats: calculateStatsFromTasks(updatedTasksAdd)
      };
    case 'UPDATE_TASK':
      console.log('Updating task:', action.payload);
      const updatedTasks = state.tasks.map(task =>
        task._id === action.payload._id ? action.payload : task
      );
      console.log('Updated tasks count:', updatedTasks.length);
      return {
        ...state,
        tasks: updatedTasks,
        taskStats: calculateStatsFromTasks(updatedTasks)
      };
    case 'DELETE_TASK':
      console.log('Deleting task:', action.payload);
      const filteredTasks = state.tasks.filter(task => task._id !== action.payload);
      console.log('Remaining tasks count:', filteredTasks.length);
      return {
        ...state,
        tasks: filteredTasks,
        taskStats: calculateStatsFromTasks(filteredTasks)
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks(); // This now also calculates stats locally
      fetchTaskStats(); // Also fetch from API for accuracy/backup
      fetchUpcomingTasks();
      
      // Clean up existing listeners first to prevent duplicates
      console.log('🧹 Cleaning up existing socket listeners');
      socketService.off('task-create');
      socketService.off('task-update');
      socketService.off('task-delete');
      socketService.off('new-activity');
      
      // Then set up new listeners
      setupSocketListeners();
    }

    return () => {
      // Clean up socket listeners on unmount
      console.log('🧹 Cleaning up socket listeners on unmount');
      socketService.off('task-create');
      socketService.off('task-update');
      socketService.off('task-delete');
      socketService.off('new-activity');
    };
  }, [user]);

  const setupSocketListeners = () => {
    console.log('🔧 Setting up socket listeners');
    
    // Listen for real-time task updates
    socketService.onTaskCreate((task) => {
      console.log('📋 Task created via socket:', task);
      // Only add if it doesn't already exist (prevents double-add from API + socket)
      dispatch({ type: 'ADD_TASK', payload: task });
      // Stats are automatically calculated in the reducer
      console.log('📊 Stats updated via socket task create');
    });

    socketService.onTaskUpdate((task) => {
      console.log('📋 Task updated via socket:', task);
      dispatch({ type: 'UPDATE_TASK', payload: task });
      // Stats are automatically calculated in the reducer
      console.log('📊 Stats updated via socket task update');
    });

    socketService.onTaskDelete((taskId) => {
      console.log('📋 Task deleted via socket:', taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
      // Stats are automatically calculated in the reducer
      console.log('📊 Stats updated via socket task delete');
    });

    socketService.onNewActivity((activity) => {
      console.log('📝 New activity via socket:', activity);
      // You can dispatch to activity context if needed
    });
  };

  const fetchTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await taskService.getAllTasksByUserId(state.filters);
      const tasks = response.tasks || response;
      dispatch({ type: 'SET_TASKS', payload: tasks });
      // Stats are automatically calculated in the SET_TASKS reducer
      console.log('📊 Stats calculated from fetched tasks');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch tasks' });
    }
  };

  const fetchTaskStats = async () => {
    try {
      const response = await taskService.getTaskStats();
      dispatch({ type: 'SET_TASK_STATS', payload: response });
    } catch (error) {
      console.error('Failed to fetch task stats:', error);
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const response = await taskService.getUpcomingTasks();
      dispatch({ type: 'SET_UPCOMING_TASKS', payload: response.tasks || response });
    } catch (error) {
      console.error('Failed to fetch upcoming tasks:', error);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      // Immediately update UI for better UX, socket acts as sync mechanism
      dispatch({ type: 'ADD_TASK', payload: response });
      // Stats are automatically calculated in the reducer
      console.log('📊 Stats updated after task creation');
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to create task' });
      throw error;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData);
      // Immediately update UI for better UX, socket acts as sync mechanism
      dispatch({ type: 'UPDATE_TASK', payload: response.task });
      // Stats are automatically calculated in the reducer
      console.log('📊 Stats updated after task update');
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update task' });
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      // Immediately update UI for better UX, socket acts as sync mechanism
      dispatch({ type: 'DELETE_TASK', payload: taskId });
      // Stats are automatically calculated in the reducer
      console.log('📊 Stats updated after task deletion');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to delete task' });
      throw error;
    }
  };

  const refreshStats = () => {
    console.log('🔄 Manually refreshing stats from current tasks');
    const currentStats = calculateStatsFromTasks(state.tasks);
    dispatch({ type: 'SET_TASK_STATS', payload: currentStats });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Refetch tasks when filters change
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [state.filters]);

  const value = {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    clearError,
    refreshStats, // Local stats calculation
    refreshStatsFromAPI: fetchTaskStats, // API-based stats refresh
    refreshUpcoming: fetchUpcomingTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};