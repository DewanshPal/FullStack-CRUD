import axiosInstance from './axiosInstance';

export const taskService = {
  // Create a new task
  createTask: async (taskData) => {
    const response = await axiosInstance.post('/tasks/ct', taskData);
    return response.data;
  },

  // Update a task
  updateTask: async (taskId, taskData) => {
    const response = await axiosInstance.put(`/tasks/ut/${taskId}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (taskId) => {
    // console.log('Deleting task with ID:', taskId);
    const response = await axiosInstance.delete(`/tasks/dt/${taskId}`);
    return response.data;
  },

  // Get all tasks by user ID
  getAllTasksByUserId: async ( filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    const response = await axiosInstance.get(`/tasks/gat/?${params}`);
    return response.data;
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    const response = await axiosInstance.get(`/tasks/gtbi/${taskId}`);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async () => {
    const response = await axiosInstance.get(`/tasks/gts`);
    return response.data;
  },

  // Get upcoming tasks (next 7 days)
  getUpcomingTasks: async () => {
    const response = await axiosInstance.get(`/tasks/gut`);
    return response.data;
  },

  // Get tasks with pagination
  getTasksWithPagination: async (userId, page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    const response = await axiosInstance.get(`/tasks/user/${userId}?${params}`);
    return response.data;
  },
};