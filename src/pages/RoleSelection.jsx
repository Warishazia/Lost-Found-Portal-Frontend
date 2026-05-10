import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <div className="role-selection-bg"></div>

      <div className="role-selection-content">
        {}
        <div className="role-header">
          <div className="role-logo">Lost & Found</div>
          <h1 className="role-title">Lost & Found Campus Portal</h1>
          <p className="role-subtitle">Select your role to continue</p>
        </div>

        {}
        <div className="role-cards-container">
          {}
          <div className="role-card student-card">
            <div className="card-icon">Student</div>
            <h2 className="card-title">Student</h2>
            <p className="card-description">
              Post lost items, find found items, and claim your belongings
            </p>
            <ul className="card-features">
              <li>Post lost items</li>
              <li>Post found items</li>
              <li>Search & filter</li>
              <li>Claim items</li>
              <li>Chat with users</li>
            </ul>

            <div className="card-actions">
              <button
                onClick={() => navigate('/auth/student/login')}
                className="btn-action student-login"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/student/register')}
                className="btn-action student-register"
              >
                Register
              </button>
            </div>
          </div>

          {}
          <div className="role-card admin-card">
            <div className="card-icon">Admin</div>
            <h2 className="card-title">Admin</h2>
            <p className="card-description">
              Manage items, users, claims, and monitor the platform
            </p>
            <ul className="card-features">
              <li>Manage all items</li>
              <li>Manage users</li>
              <li>View all claims</li>
              <li>Delete violations</li>
              <li>Analytics dashboard</li>
            </ul>

            <div className="card-actions">
              <button
                onClick={() => navigate('/auth/admin/login')}
                className="btn-action admin-login"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/admin/register')}
                className="btn-action admin-register"
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {}
        <div className="role-footer">
          <p>Choose your role to get started</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;