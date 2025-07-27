import React, { useState } from 'react';
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

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dueDateStatus = getDueDateStatus(task.dueDate, task.status);
  
  const getDueDateColor = () => {
    switch (dueDateStatus) {
      case 'overdue':
        return 'text-danger-600';
      case 'today':
        return 'text-warning-600';
      case 'tomorrow':
        return 'text-primary-600';
      default:
        return 'text-gray-500';
    }
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === TASK_STATUS.COMPLETED 
      ? TASK_STATUS.TODO 
      : TASK_STATUS.COMPLETED;
    onStatusChange(task._id, newStatus);
  };

  return (
    <>
      <div className="card hover:shadow-md transition-shadow pt-5">
        <div className="card-content">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* Status Toggle */}
              <button
                onClick={handleStatusToggle}
                className="mt-1 text-gray-400 hover:text-primary-600 transition-colors"
              >
                {task.status === TASK_STATUS.COMPLETED ? (
                  <CheckCircle className="h-5 w-5 text-success-600" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-medium ${
                  task.status === TASK_STATUS.COMPLETED 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
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
                  <div className="flex items-center text-xs text-gray-400">
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
                className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDelete(task._id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
};

export default TaskCard;