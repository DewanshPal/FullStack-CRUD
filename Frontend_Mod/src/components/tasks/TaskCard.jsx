import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react';
import { formatDate, getDueDateStatus } from '../../utils/dateUtils';
import { getStatusColor, getPriorityColor, TASK_STATUS } from '../../utils/taskUtils';
import ConfirmDialog from '../common/ConfirmDialog';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, index = 0 }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dueDateStatus = getDueDateStatus(task.dueDate, task.status);
  
  const getDueDateColor = () => {
    switch (dueDateStatus) {
      case 'overdue':
        return 'text-danger-600 dark:text-danger-400';
      case 'today':
        return 'text-warning-600 dark:text-warning-400';
      case 'tomorrow':
        return 'text-primary-600 dark:text-primary-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === TASK_STATUS.COMPLETED 
      ? TASK_STATUS.TODO 
      : TASK_STATUS.COMPLETED;
    onStatusChange(task._id, newStatus);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Add a small delay to show the animation
    setTimeout(() => {
      onDelete(task._id);
    }, 200);
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.9,
      rotateX: 15,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const hoverVariants = {
    hover: { 
      y: -8,
      scale: 1.02,
      rotateX: 5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.div 
        className={`card hover:shadow-lg transition-shadow pt-5 ${isDeleting ? 'pointer-events-none' : ''}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        layout
        style={{
          transformPerspective: 1000,
        }}
      >
        <div className="card-content">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* Status Toggle */}
              <button
                onClick={handleStatusToggle}
                className="mt-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {task.status === TASK_STATUS.COMPLETED ? (
                  <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-medium ${
                  task.status === TASK_STATUS.COMPLETED 
                    ? 'line-through text-gray-500 dark:text-gray-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Task Meta */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>

                  {/* Priority Badge */}
                  <span className={`badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>

                  {/* Due Date */}
                  {task.dueDate && (
                    <div className={`flex items-center text-xs ${getDueDateColor()}`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(task.dueDate)}
                      {dueDateStatus === 'overdue' && (
                        <AlertCircle className="h-3 w-3 ml-1" />
                      )}
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Created {formatDate(task.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
};

export default TaskCard;