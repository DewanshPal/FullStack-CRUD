import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import ActivityFeed from '../components/activities/ActivityFeed';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  console.log('Dashboard component rendered');
  const { user } = useAuth();
  const { taskStats, upcomingTasks, tasks, loading, refreshStats } = useTask();

   // Log all context values
  console.log("Dashboard Rendered");
  console.log("user:", user);
  console.log("taskStats:", taskStats);
  console.log("upcomingTasks:", upcomingTasks);
  console.log("tasks:", tasks);
  console.log("loading:", loading);

  
  useEffect(() => {
    console.log("Dashboard mounted");
  }, []);

  // Log when stats change for debugging real-time updates
  useEffect(() => {
    console.log('📊 Dashboard detected stats change:', taskStats);
  }, [taskStats]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const recentTasks = Array.isArray(tasks) ? tasks.slice(0, 5) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!user) {
    return <div>User not loaded</div>;
  }
  if (!Array.isArray(tasks)) {
    return <div>Tasks not loaded</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {capitalizeFirstLetter(user?.username)}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your tasks today.
            </p>
          </div>
          {/* Debug button - remove in production */}
          <button 
            onClick={refreshStats}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
            title="Refresh stats"
          >
            🔄 Refresh Stats
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={taskStats?.total || 0}
          icon={CheckSquare}
          color="primary"
        />
        <StatsCard
          title="Completed"
          value={taskStats?.completed || 0}
          icon={CheckSquare}
          color="success"
        />
        <StatsCard
          title="In Progress"
          value={taskStats?.inProgress || 0}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Overdue"
          value={taskStats?.overdue || 0}
          icon={AlertCircle}
          color="danger"
        />
      </div>

      {/* Progress Overview */}
      {taskStats && taskStats.total > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Progress Overview
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>{Math.round((taskStats.completed / taskStats.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-success-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.pending || 0}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning-600">{taskStats.inProgress || 0}</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success-600">{taskStats.completed || 0}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <RecentTasks 
          tasks={upcomingTasks} 
          title={
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Tasks
            </div>
          }
        />

        {/* Recent Tasks */}
        <RecentTasks tasks={recentTasks} />
      </div>

      {/* Activity Feed */}
      <ActivityFeed limit={10} />
    </div>
  );
};

export default Dashboard;