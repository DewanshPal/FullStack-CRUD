import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { filterTasks } from '../utils/taskUtils';

const Tasks = () => {
  const {
    tasks,
    loading,
    error,
    filters,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    fetchTasks,
    clearError,
  } = useTask();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateTask = async (taskData) => {
    try {
      setFormLoading(true);
      await createTask(taskData);
      setIsCreateModalOpen(false);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      setFormLoading(true);
      await updateTask(editingTask._id, taskData);
      setIsEditModalOpen(false);
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      search: '',
    });
  };

  const filteredTasks = filterTasks(tasks, filters);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600 mb-4">{error}</p>
        <button onClick={() => { clearError(); fetchTasks(); }} className="btn-primary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize your tasks efficiently
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="xl" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          </p>
          {tasks.length === 0 && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        title="Edit Task"
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Tasks;