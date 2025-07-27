import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { activityService } from '../../services/activityService';
import socketService from '../../services/socketService';
import { formatTimeAgo } from '../../utils/dateUtils';
import { 
  CheckCircle, 
  Plus, 
  Edit, 
  Trash2, 
  User,
  Clock,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const ActivityFeed = ({ limit, showHeader = true }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchActivities();
      setupSocketListeners();
    }

    return () => {
      socketService.off('new-activity');
      socketService.off('activity-update');
    };
  }, [user, limit]);

  const setupSocketListeners = () => {
    socketService.onNewActivity((activity) => {
      setActivities(prev => [activity, ...prev]);
    });

    socketService.onActivityUpdate((updatedActivities) => {
      setActivities(updatedActivities);
    });
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getAllActivities(1, limit || 20);
      console.log('Fetched activities:', response);
      setActivities(response.activities || response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
        return <Plus className="h-4 w-4 text-success-600" />;
      case 'task_updated':
        return <Edit className="h-4 w-4 text-primary-600" />;
      case 'task_deleted':
        return <Trash2 className="h-4 w-4 text-danger-600" />;
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'user_login':
        return <User className="h-4 w-4 text-primary-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_created':
      case 'task_completed':
        return 'border-success-200 bg-success-50';
      case 'task_updated':
        return 'border-primary-200 bg-primary-50';
      case 'task_deleted':
        return 'border-danger-200 bg-danger-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-600 mb-4">{error}</p>
        <button onClick={fetchActivities} className="btn-primary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={showHeader ? 'card' : ''}>
      {showHeader && (
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Activity Feed</h3>
            <button
              onClick={fetchActivities}
              className="text-gray-400 hover:text-gray-600"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className={showHeader ? 'card-content' : ''}>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activities yet</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;