//repetitive use of props due to sharing information among different components of the project because of this context is introduced as the problem to this solution , we are managing state of information at different levels of the application(components) thats why it is called state management library redux is the example of it(used in industry level project) , one place to manage or update the values analogy to understand the createContext() --> loud speaker , provider  --> turns on the loud speaker  , usecontext() --> lets you hear and use the info , if we add the initial state (single source of truth ) , reducer (a control center to update it predictably) , reducer has the state(saves the unchanged data) , action(type and payload are used to perform which action at what action.type and using action.payload) , dispatch is used to set the type and payload values for using reducer 

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import socketService from '../services/socketService';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: authService.isAuthenticated(action.payload),
        loading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  console.log('AuthProvider state:', state);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getUserProfile();
          console.log('User data from localStorage:', userData);
          dispatch({ type: 'SET_USER', payload: userData });

          // Connect to socket
          socketService.connect(userData._id);
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(credentials);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      // Connect to socket
      socketService.connect(response.user._id);
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.register(userData);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      // Connect to socket
      socketService.connect(response.user._id);
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Registration failed' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      socketService.disconnect();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if server request fails
      socketService.disconnect();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateUserDetails(userData);
      dispatch({ type: 'SET_USER', payload: response.user });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Update failed' });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};