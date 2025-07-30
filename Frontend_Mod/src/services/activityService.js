import axiosInstance from './axiosInstance';

export const activityService = {
  // Get all activities for a user
  getAllActivities: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get(`/activities/gaa?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Clear all activities for a user
  clearActivities: async (userId) => {
    const response = await axiosInstance.delete(`/activities/ca`);
    return response.data;
  },

  // Get recent activities (for dashboard)
  getRecentActivities: async (userId, limit = 5) => {
    const response = await axiosInstance.get(`/activities/${userId}?limit=${limit}`);
    return response.data;
  },

  // Log an activity
  logActivity: async (activityData) => {
    const response = await axiosInstance.post('/activities/log', activityData);
    return response.data;
  },
};