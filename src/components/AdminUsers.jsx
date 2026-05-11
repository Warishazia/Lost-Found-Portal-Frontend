import { useEffect, useState } from 'react';
import api from '../services/Api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = roleFilter ? `?role=${roleFilter}` : '';
      const response = await api.get(`/admin/users${params}`);
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const reason = prompt('Enter reason for deletion:');
    if (reason === null) return;

    try {
      await api.delete(`/admin/users/${userId}`, {
        data: { reason },
      });
      setUsers(users.filter((user) => user._id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      {}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">Filter Users</h3>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input-field w-full md:w-48"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {}
      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-primary font-semibold">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Items Posted</th>
                <th className="px-6 py-3">Claims Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-700">{user.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{user.itemsPosted}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{user.claimsCreated}</td>
                  <td className="px-6 py-3">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <span className="text-xs text-gray-500">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
