import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { activityService } from '../services/activityService';
import ActivityFeed from '../components/activities/ActivityFeed';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Activities = () => {
  const { user } = useAuth();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClearActivities = async () => {
    try {
      setClearing(true);
      await activityService.clearActivities(user._id);
      toast.success('Activities cleared successfully!');
      setRefreshKey(prev => prev + 1); // Force refresh of ActivityFeed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear activities');
    } finally {
      setClearing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
          <p className="text-gray-600 mt-1">
            Track all your task-related activities and changes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="btn-danger"
            disabled={clearing}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {clearing ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div key={refreshKey}>
        <ActivityFeed showHeader={false} />
      </div>

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearActivities}
        title="Clear All Activities"
        message="Are you sure you want to clear all activities? This action cannot be undone."
        confirmText="Clear All"
        type="danger"
      />
    </div>
  );
};

export default Activities;