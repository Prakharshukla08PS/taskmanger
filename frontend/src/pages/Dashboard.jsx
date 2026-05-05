import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiClock, FiAlertCircle, FiList } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/tasks/stats/dashboard');
        setStats(res.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: FiList, color: 'bg-blue-500' },
    { title: 'To Do', value: stats?.todoTasks || 0, icon: FiAlertCircle, color: 'bg-gray-500' },
    { title: 'In Progress', value: stats?.inProgressTasks || 0, icon: FiClock, color: 'bg-yellow-500' },
    { title: 'Done', value: stats?.doneTasks || 0, icon: FiCheckCircle, color: 'bg-green-500' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: FiAlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-100">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
