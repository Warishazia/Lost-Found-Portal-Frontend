import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/Api';

const SearchFilter = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: 'active',
    search: '',
  });

  const categories = ['electronics', 'clothing', 'accessories', 'documents', 'keys', 'other'];
  const types = ['lost', 'found'];
  const statuses = ['active', 'claimed', 'resolved'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (filterOverrides = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const currentFilters = { ...filters, ...filterOverrides };

      if (currentFilters.type) params.append('type', currentFilters.type);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.status) params.append('status', currentFilters.status);
      if (currentFilters.search) params.append('search', currentFilters.search);

      const response = await api.get(`/items?${params.toString()}`);
      setItems(response.data.items);
    } catch (err) {
      console.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleFilterClick = (filterName, filterValue) => {
    const newFilters = { ...filters, [filterName]: filterValue };
    setFilters(newFilters);
    fetchItems(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Search & Filter Items</h1>

      {}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-primary mb-6">Filters</h2>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="Search by title, description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Types</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t === 'lost' ? '❌ Lost' : '✅ Found'}
                  </option>
                ))}
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
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
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button type="submit" className="btn-primary">
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters({ type: '', category: '', status: 'active', search: '' });
                fetchItems({ type: '', category: '', status: 'active', search: '' });
              }}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Filters:</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleFilterClick('type', 'lost')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              filters.type === 'lost'
                ? 'bg-red-500 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
             Lost Items
          </button>
          <button
            onClick={() => handleFilterClick('type', 'found')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              filters.type === 'found'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
             Found Items
          </button>
          <button
            onClick={() => handleFilterClick('type', '')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              filters.type === ''
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Items
          </button>
        </div>
      </div>

      {}
      <div>
        <h2 className="text-xl font-semibold text-primary mb-6">
          Results {loading ? '(Loading...)' : `(${items.length} found)`}
        </h2>

        {loading ? (
          <div className="text-center py-8">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg">No items found matching your filters.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link key={item._id} to={`/item/${item._id}`} className="card cursor-pointer group">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-80 transition"
                  />
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.type === 'lost'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="space-y-2 text-sm">
                  <p className="text-secondary font-medium">📍 {item.location}</p>
                  <p className="text-gray-500">
                    📅 {new Date(item.date).toLocaleDateString()}
                  </p>
                  {item.reward > 0 && (
                    <p className="text-green-600 font-semibold">💰 {item.reward} PKR Reward</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-500">By: {item.postedBy.name}</span>
                  <span className="text-xs text-gray-400">👁️ {item.views} views</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
