import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getStatusColor, getPriorityColor } from '../../utils/taskUtils';

const RecentTasks = ({ tasks, title = "Recent Tasks" }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="card-content">
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tasks found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <Link
            to="/tasks"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
          >
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.slice(0, 5).map((task, index) => (
              <motion.div 
                key={task._id} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ x: 5 }}
                layout
              >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {task.title}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`badge text-xs ${getStatusColor(task.status)}`}>
                    {task.status ? task.status.replace('-', ' ') : 'No Status'}
                  </span>
                  <span className={`badge text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'No Priority'}
                  </span>
                  {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(task.dueDate)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RecentTasks;