import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: '',
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);

      const response = await api.get(`/admin/items?${params.toString()}`);
      setItems(response.data.items);
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    const reason = prompt('Enter reason for deletion:');
    if (reason === null) return;

    try {
      await api.delete(`/admin/items/${itemId}`, {
        data: { reason },
      });
      setItems(items.filter((item) => item._id !== itemId));
      alert('Item deleted successfully');
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="claimed">Claimed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="documents">Documents</option>
              <option value="keys">Keys</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {}
      {loading ? (
        <div className="text-center py-8">Loading items...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-600">No items found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-primary font-semibold">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Posted By</th>
                <th className="px-6 py-3">Views</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-700">{item.title}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.type === 'lost'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{item.postedBy.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">👁️ {item.views}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                    >
                      Delete
                    </button>
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

export default AdminItems;