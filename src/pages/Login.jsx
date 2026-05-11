import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/Api';
import './Auth.css';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const { role } = useParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { ...formData, role });
      const { token, user } = response.data;

      if (user.role !== role) {
        setError(`This account is registered as "${user.role}", not "${role}". Please use the correct login.`);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);

      onLoginSuccess(token, user.role);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => (role === 'admin' ? 'Admin' : 'Student');
  const getRoleTitle = () => (role === 'admin' ? 'Admin Login' : 'Student Login');

  return (
    <div className={`auth-container ${role === 'admin' ? 'admin' : 'student'}`}>
      <div className="auth-bg"></div>

      <div className="auth-wrapper">
        {}
        <button
          onClick={() => navigate('/auth')}
          className="auth-back-button"
          title="Go back"
        >
          Back
        </button>

        <div className={`auth-card ${role === 'admin' ? 'admin-card' : ''}`}>
          <div className="auth-header">
            <h1 className="auth-title">
              <span>{getRoleLabel()}</span> {getRoleTitle()}
            </h1>
            <p className="auth-subtitle">
              Welcome to Lost & Found Portal
              <span className={`role-badge ${role}`}>
                {role?.toUpperCase()}
              </span>
            </p>
          </div>

          {error && (
            <div className="auth-alert alert-error">
              <span className="alert-icon">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="your.email@university.edu"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`auth-submit ${role}`}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : `${getRoleLabel()} Login`}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to={`/auth/${role}/register`} className="auth-link">
                Register here
              </Link>
            </p>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            {role === 'student' ? (
              <div className="demo-item">
                <strong>student@test.com</strong> / password123
              </div>
            ) : (
              <div className="demo-item">
                <strong>admin@test.com</strong> / password123
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
