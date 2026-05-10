import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-bg"></div>

      <div className="landing-content">
        {}
        <div className="landing-header">
          <div className="landing-logo">Lost & Found</div>
          <h1 className="landing-title">Lost & Found Campus Portal</h1>
          <p className="landing-subtitle">
            Help find lost items and reunite them with their owners on campus
          </p>
        </div>

        {}
        <div className="landing-cta">
          <p className="landing-question">How would you like to continue?</p>
        </div>

        {}
        <div className="landing-cards-container">
          {/* Student Card */}
          <div className="landing-card student-card">
            <div className="card-icon">Student</div>
            <h2 className="card-title">Student</h2>
            <p className="card-description">
              Post lost items, find found items, and claim your belongings
            </p>
            <ul className="card-features">
              <li>Post lost items</li>
              <li>Post found items</li>
              <li>Search & filter items</li>
              <li>Claim items</li>
              <li>Chat with others</li>
            </ul>

            <div className="card-actions">
              <button
                onClick={() => navigate('/auth/student/register')}
                className="btn-register"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/auth/student/login')}
                className="btn-login"
              >
                Login
              </button>
            </div>
          </div>

          {}
          <div className="landing-card admin-card">
            <div className="card-icon">Admin</div>
            <h2 className="card-title">Admin</h2>
            <p className="card-description">
              Manage items, users, claims, and monitor the platform
            </p>
            <ul className="card-features">
              <li>Manage all items</li>
              <li>Delete inappropriate items</li>
              <li>Manage users</li>
              <li>View all claims</li>
              <li>Analytics dashboard</li>
            </ul>

            <div className="card-actions">
              <button
                onClick={() => navigate('/auth/admin/register')}
                className="btn-register admin"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/auth/admin/login')}
                className="btn-login admin"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {}
        <div className="landing-footer">
          <p className="footer-text">Demo Credentials Available After Registration</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;