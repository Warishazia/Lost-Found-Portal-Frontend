import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [profileRes, itemsRes, claimsRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/items/user/my-items'),
        api.get('/claims/my-claims'),
      ]);

      setUser(profileRes.data);
      setUserItems(itemsRes.data.items);
      setClaims(claimsRes.data.claims);

      setFormData({
        name: profileRes.data.name,
        phone: profileRes.data.phone || '',
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    alert('Profile update feature coming soon');
    setEditMode(false);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${itemId}`);
        setUserItems(userItems.filter((item) => item._id !== itemId));
        alert('Item deleted successfully');
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded-lg">
          User data not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            activeTab === 'items'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Items ({userItems.length})
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            activeTab === 'claims'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
           My Claims ({claims.length})
        </button>
      </div>

      {}
      {activeTab === 'profile' && (
        <div className="card max-w-2xl">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-primary">Profile Information</h1>
            <button
              onClick={() => setEditMode(!editMode)}
              className="btn-outline"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+92..."
                />
              </div>

              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Full Name</p>
                <p className="text-lg text-gray-800">{user.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-lg text-gray-800">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Phone</p>
                <p className="text-lg text-gray-800">{user.phone || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Account Type</p>
                <p className="text-lg text-gray-800 capitalize">{user.role}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Member Since</p>
                <p className="text-lg text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {}
      {activeTab === 'items' && (
        <div>
          {userItems.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 text-lg">You haven't posted any items yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userItems.map((item) => (
                <div key={item._id} className="card">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.type === 'lost'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === 'active'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-primary mb-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-2">
                        {item.description.substring(0, 100)}...
                      </p>

                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>📍 {item.location}</span>
                        <span>👁️ {item.views} views</span>
                        <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {}
      {activeTab === 'claims' && (
        <div>
          {claims.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 text-lg">You haven't made any claims yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim._id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        {claim.itemId.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3">{claim.claimMessage}</p>

                      <div className="flex gap-6 text-sm text-gray-600 mb-3">
                        <span>
                          📅{' '}
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </span>
                        <span>👤 Item Owner: {claim.itemOwner.name}</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                        claim.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : claim.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </div>

                  {claim.status === 'rejected' && claim.rejectionReason && (
                    <div className="p-3 bg-red-100 rounded-lg mt-3">
                      <p className="text-red-700 text-sm">
                        <span className="font-semibold">Rejection Reason:</span>{' '}
                        {claim.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
