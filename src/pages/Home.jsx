import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/Api';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items?status=active');
        setItems(response.data.items.slice(0, 12));
      } catch (err) {
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading items...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Lost & Found</h1>
        <p className="text-gray-600 text-lg mb-6">
          Help find lost items and reunite them with their owners on campus.
        </p>

        {userRole === 'student' && (
          <div className="flex gap-4">
            <Link to="/post-lost" className="btn-primary">Post Lost Item</Link>
            <Link to="/post-found" className="btn-secondary">Post Found Item</Link>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Recent Items</h2>
        {items.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No items yet. Be the first to post!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link key={item._id} to={`/item/${item._id}`} className="card cursor-pointer">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                  </span>
                  <span className="text-xs text-gray-500">{item.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description.substring(0, 80)}...</p>
                <p className="text-sm text-secondary font-medium">📍 {item.location}</p>
                <p className="text-xs text-gray-500 mt-2">Posted by: {item.postedBy.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="text-center mt-12">
        <Link to="/search" className="btn-outline text-lg px-8 py-3">
          Browse All Items
        </Link>
      </div>
    </div>
  );
};

export default Home;
