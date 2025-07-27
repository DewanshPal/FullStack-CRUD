import React from 'react';
import { Search, Filter } from 'lucide-react';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/taskUtils';

const TaskFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input"
          >
            <option value="">All Status</option>
            <option value={TASK_STATUS.TODO}>Pending</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="input"
          >
            <option value="">All Priority</option>
            <option value={TASK_PRIORITY.LOW}>Low</option>
            <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
            <option value={TASK_PRIORITY.HIGH}>High</option>
            <option value={TASK_PRIORITY.URGENT}>Urgent</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;