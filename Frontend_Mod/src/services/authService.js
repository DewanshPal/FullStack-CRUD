import axiosInstance from './axiosInstance';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials ,{ withCredentials: true } );
    const { accessToken, refreshToken, user } = response.data;
    
    // Store tokens
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      console.log('Logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get user profile
  getUserProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    
    const { token } = response.data;
    localStorage.setItem('token', token);
    
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/auth/cup', passwordData);
    return response.data;
  },

  // Update user details
  updateUserDetails: async (userData) => {
    const response = await axiosInstance.put('/auth/uud', userData);
    
    // Update stored user data
    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (user) => {
    return user && localStorage.token ? true : false;
  },
};