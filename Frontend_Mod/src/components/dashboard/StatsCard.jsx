import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400',
    warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
    danger: 'bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400',
  };

  return (
    <div className="card pt-4">
      <div className="card-content">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <p className={`text-sm ${trend.positive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;