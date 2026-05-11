import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/Api';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError('Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading item...</div>;
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

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded-lg">
          Item not found
        </div>
      </div>
    );
  }

  const isOwner = item.postedBy._id === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {}
        <div className="md:col-span-2">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}

          <div className="mt-8 card">
            <h2 className="text-2xl font-bold text-primary mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>

            {item.color && (
              <p className="mt-4 text-gray-700">
                <span className="font-semibold">Color:</span> {item.color}
              </p>
            )}
            {item.brand && (
              <p className="mt-2 text-gray-700">
                <span className="font-semibold">Brand:</span> {item.brand}
              </p>
            )}
          </div>
        </div>

        {}
        <div className="space-y-6">
          <div className="card">
            <h1 className="text-3xl font-bold text-primary mb-2">{item.title}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.type === 'lost'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {item.type === 'lost' ? 'Lost' : 'Found'}
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

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Category:</span>{' '}
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {item.location}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{' '}
                {new Date(item.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Views:</span> {item.views}
              </p>
            </div>

            {item.reward > 0 && (
              <div className="mt-4 p-3 bg-lightGreen rounded-lg">
                <p className="text-green-700 font-bold text-lg">💰 {item.reward} PKR Reward</p>
              </div>
            )}
          </div>

          {}
          <div className="card">
            <h3 className="text-lg font-semibold text-primary mb-4">Posted By</h3>
            <div>
              <p className="text-gray-700 font-semibold">{item.postedBy.name}</p>
              <p className="text-gray-500 text-sm">{item.postedBy.email}</p>
              {item.postedBy.phone && (
                <p className="text-gray-500 text-sm">📱 {item.postedBy.phone}</p>
              )}
            </div>

            {!isOwner && item.status === 'active' && (
              <div className="mt-4 space-y-2">
                <Link
                  to={`/claim/${item._id}`}
                  className="block text-center btn-primary"
                >
                  Claim This Item
                </Link>
                <Link
                  to={`/chat?userId=${item.postedBy._id}&itemId=${item._id}`}
                  className="block text-center btn-secondary"
                >
                  Contact Owner
                </Link>
              </div>
            )}

            {isOwner && (
              <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                This is your item
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
