export const TASK_STATUS = {
  TODO: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const getStatusColor = (status) => {
  switch (status) {
    case TASK_STATUS.TODO:
      return 'bg-gray-100 text-gray-800';
    case TASK_STATUS.IN_PROGRESS:
      return 'bg-primary-100 text-primary-800';
    case TASK_STATUS.COMPLETED:
      return 'bg-success-100 text-success-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.LOW:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
    case TASK_PRIORITY.MEDIUM:
      return 'bg-warning-100 text-warning-800 border border-warning-300';
    case TASK_PRIORITY.HIGH:
      return 'bg-danger-100 text-red-800 border border-red-300';
    case TASK_PRIORITY.URGENT:
      return 'bg-violet-100 text-violet-800 border border-violet-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case TASK_STATUS.TODO:
      return '⏳';
    case TASK_STATUS.IN_PROGRESS:
      return '🔄';
    case TASK_STATUS.COMPLETED:
      return '✅';
    default:
      return '⏳';
  }
};

export const getPriorityIcon = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.LOW:
      return '🟢';
    case TASK_PRIORITY.MEDIUM:
      return '🟡';
    case TASK_PRIORITY.HIGH:
      return '🟠';
    case TASK_PRIORITY.URGENT:
      return '🔴';
    default:
      return '🟢';
  }
};

export const sortTasksByPriority = (tasks) => {
  const priorityOrder = {
    [TASK_PRIORITY.URGENT]: 4,
    [TASK_PRIORITY.HIGH]: 3,
    [TASK_PRIORITY.MEDIUM]: 2,
    [TASK_PRIORITY.LOW]: 1,
  };

  return [...tasks].sort((a, b) => {
    return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
  });
};

export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesSearch = !filters.search || 
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });
};

export const getTaskProgress = (tasks) => {
  if (!tasks.length) return 0;
  
  const completedTasks = tasks.filter(task => task.status === TASK_STATUS.COMPLETED);
  return Math.round((completedTasks.length / tasks.length) * 100);
};