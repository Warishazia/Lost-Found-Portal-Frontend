import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PostItem.css';

const PostLostItem = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    location: '',
    date: '',
    color: '',
    brand: '',
    reward: 0,
    image: null,
    imagePreview: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['electronics', 'clothing', 'accessories', 'documents', 'keys', 'other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      setError('Title, description, location, and date are required');
      return false;
    }
    if (formData.title.length < 3) {
      setError('Title must be at least 3 characters');
      return false;
    }
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('location', formData.location);
      submitData.append('date', formData.date);
      submitData.append('color', formData.color);
      submitData.append('brand', formData.brand);
      submitData.append('reward', parseInt(formData.reward) || 0);
      submitData.append('type', 'lost');

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      let imageUrl = '';
      if (formData.imagePreview) {
        imageUrl = formData.imagePreview;
      }

      const response = await api.post('/items', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        color: formData.color,
        brand: formData.brand,
        reward: parseInt(formData.reward) || 0,
        type: 'lost',
        image: imageUrl,
      });

      alert('Lost item posted successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-item-container">
      <div className="post-item-wrapper">
        <div className="post-item-card">
          <h1 className="post-title">Post Lost Item</h1>
          <p className="post-subtitle">Help us find your lost item</p>

          {error && (
            <div className="post-alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="post-form">
            {}
            <div className="image-upload-section">
              <h3 className="section-title">Upload Item Photo</h3>
              
              {formData.imagePreview ? (
                <div className="image-preview-container">
                  <img 
                    src={formData.imagePreview} 
                    alt="Preview" 
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="btn-remove-image"
                  >
                    ✕ Remove Image
                  </button>
                </div>
              ) : (
                <div className="image-upload-box">
                  <div className="upload-icon">📷</div>
                  <p className="upload-text">Click or drag image here</p>
                  <p className="upload-hint">PNG, JPG, GIF (Max 5MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </div>
              )}
            </div>

            {}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Item Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Black iPhone 13"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Library Building, 2nd Floor"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date Lost *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Black"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand/Model</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Apple"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reward (PKR)</label>
                <input
                  type="number"
                  name="reward"
                  value={formData.reward}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 5000"
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>

            {}
            <div className="form-group full-width">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe your lost item in detail (condition, identifying marks, accessories, etc.)"
                rows="5"
                disabled={loading}
              />
              <p className="char-count">
                {formData.description.length} / 500 characters
              </p>
            </div>

            {}
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Lost Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostLostItem;