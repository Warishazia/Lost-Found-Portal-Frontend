import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/Api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: role || 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form');
  const [registeredUser, setRegisteredUser] = useState(null);

  useEffect(() => {
    if (role) {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setRegisteredUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });

      setStep('success');

      setTimeout(() => {
        navigate(`/auth/${formData.role}/login`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => (formData.role === 'admin' ? 'Admin' : 'Student');
  const getRoleTitle = () => (formData.role === 'admin' ? 'Admin Registration' : 'Student Registration');

  return (
    <div className={`auth-container ${formData.role}`}>
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

        {step === 'form' && (
          <div className={`auth-card ${formData.role === 'admin' ? 'admin-card' : ''}`}>
            <div className="auth-header">
              <h1 className="auth-title">
                <span>{getRoleLabel()}</span> {getRoleTitle()}
              </h1>
              <p className="auth-subtitle">
                Create your account
                <span className={`role-badge ${formData.role}`}>
                  {formData.role.toUpperCase()}
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
                <label htmlFor="name" className="form-label">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>

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
                  placeholder="At least 6 characters"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Re-enter password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className={`auth-submit ${formData.role}`}
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : `Create ${getRoleLabel()} Account`}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to={`/auth/${formData.role}/login`} className="auth-link">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        )}

        {step === 'success' && registeredUser && (
          <div className={`auth-card success-card ${registeredUser.role === 'admin' ? 'admin-card' : ''}`}>
            <div className="success-icon">✅</div>
            <h2 className="success-title">Registration Successful!</h2>

            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{registeredUser.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{registeredUser.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role:</span>
                <span className={`detail-role ${registeredUser.role}`}>
                  {registeredUser.role.toUpperCase()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-status">Active</span>
              </div>
            </div>

            <p className="success-message">
              Your {registeredUser.role} account has been created successfully.
              Redirecting to login...
            </p>
            <button
              onClick={() => navigate(`/auth/${registeredUser.role}/login`)}
              className="btn-primary btn-lg"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
