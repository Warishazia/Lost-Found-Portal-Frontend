import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminItems from '../components/AdminItems';
import AdminUsers from '../components/AdminUsers';
import AdminClaims from '../components/AdminClaims';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const userRole = localStorage.getItem('userRole');
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/home');
    }
  }, [userRole, navigate]);

  if (userRole !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage items, users, and claims</p>
      </div>

      {}
      <div className="flex gap-4 mb-8 border-b overflow-x-auto">
        {[
          { key: 'analytics', label: '📊 Analytics' },
          { key: 'items', label: '📦 Items' },
          { key: 'users', label: '👥 Users' },
          { key: 'claims', label: '✋ Claims' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {}
      {activeTab === 'analytics' && <AdminAnalytics />}
      {activeTab === 'items' && <AdminItems />}
      {activeTab === 'users' && <AdminUsers />}
      {activeTab === 'claims' && <AdminClaims />}
    </div>
  );
};

export default AdminDashboard;