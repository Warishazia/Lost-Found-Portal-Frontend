import { useEffect, useState } from 'react';
import api from '../services/Api';

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await api.get(`/admin/claims${params}`);
      setClaims(response.data.claims);
    } catch (err) {
      setError('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">Filter Claims</h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-full md:w-48"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {}
      {loading ? (
        <div className="text-center py-8">Loading claims...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : claims.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-600">No claims found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-primary font-semibold">
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">Claimed By</th>
                <th className="px-6 py-3">Item Owner</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Claimed At</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-700">
                    {claim.itemId.title}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {claim.claimedBy.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {claim.itemOwner.name}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        claim.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : claim.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(claim.createdAt).toLocaleDateString()}
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

export default AdminClaims;
