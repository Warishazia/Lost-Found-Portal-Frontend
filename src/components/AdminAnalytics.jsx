import { useEffect, useState } from 'react';
import api from '../services/Api';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics');
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const StatCard = ({ icon, label, value, color }) => (
    <div className={`card border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-primary mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Users"
            value={analytics.users.total}
            color="border-primary"
          />
          <StatCard
            label="Students"
            value={analytics.users.students}
            color="border-secondary"
          />
          <StatCard
            label="Admins"
            value={analytics.users.admins}
            color="border-red-500"
          />
        </div>
      </div>

      {}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatCard
            label="Total Items"
            value={analytics.items.total}
            color="border-primary"
          />
          <StatCard
            label="Lost Items"
            value={analytics.items.lost}
            color="border-red-500"
          />
          <StatCard
            label="Found Items"
            value={analytics.items.found}
            color="border-green-500"
          />
          <StatCard
            label="Active"
            value={analytics.items.active}
            color="border-blue-500"
          />
          <StatCard
            label="Claimed"
            value={analytics.items.claimed}
            color="border-yellow-500"
          />
        </div>
      </div>

      {}
      <div className="card">
        <h3 className="text-xl font-bold text-primary mb-6">Items by Category</h3>
        <div className="space-y-3">
          {analytics.items.byCategory.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between">
              <span className="font-medium text-gray-700 capitalize">{cat._id}</span>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(cat.count / analytics.items.total) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-primary w-8">{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Claims</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCar
            label="Total Claims"
            value={analytics.claims.total}
            color="border-primary"
          />
          <StatCard
            label="Pending"
            value={analytics.claims.pending}
            color="border-yellow-500"
          />
          <StatCard
            label="Accepted"
            value={analytics.claims.accepted}
            color="border-green-500"
          />
          <StatCard
            label="Rejected"
            value={analytics.claims.rejected}
            color="border-red-500"
          />
        </div>
      </div>

      {}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            label="Total Messages"
            value={analytics.messages.total}
            color="border-primary"
          />
          <StatCard
            label="Unread"
            value={analytics.messages.unread}
            color="border-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
