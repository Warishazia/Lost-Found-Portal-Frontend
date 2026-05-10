import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import RoleSelection from './pages/RoleSelection';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PostLostItem from './pages/PostLostItem';
import PostFoundItem from './pages/PostFoundItem';
import SearchFilter from './pages/SearchFilter';
import ItemDetail from './pages/ItemDetail';
import ClaimFlow from './pages/ClaimFlow';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const handleLoginSuccess = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-accent">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-primary font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen">
          {isAuthenticated && (
            <Navbar onLogout={handleLogout} userRole={userRole} />
          )}

          <main className="flex-grow">
            <Routes>
              {}
              {}
              <Route
                path="/"
                element={
                  isAuthenticated
                    ? <Navigate to="/home" />
                    : <Landing />
                }
              />
              <Route
                path="/auth"
                element={
                  isAuthenticated
                    ? <Navigate to="/home" />
                    : <RoleSelection />
                }
              />
              <Route
                path="/auth/:role/login"
                element={
                  isAuthenticated
                    ? <Navigate to="/home" />
                    : <Login onLoginSuccess={handleLoginSuccess} />
                }
              />
              <Route
                path="/auth/:role/register"
                element={
                  isAuthenticated
                    ? <Navigate to="/home" />
                    : <Register />
                }
              />

              <Route
                path="/home"
                element={
                  <ProtectedRoute
                    element={<Home />}
                    requiredRole={null}
                  />
                }
              />

              <Route
                path="/post-lost"
                element={
                  <ProtectedRoute
                    element={<PostLostItem />}
                    requiredRole="student"
                  />
                }
              />
              <Route
                path="/post-found"
                element={
                  <ProtectedRoute
                    element={<PostFoundItem />}
                    requiredRole="student"
                  />
                }
              />
              <Route
                path="/claim/:itemId"
                element={
                  <ProtectedRoute
                    element={<ClaimFlow />}
                    requiredRole="student"
                  />
                }
              />

              <Route
                path="/search"
                element={
                  <ProtectedRoute
                    element={<SearchFilter />}
                    requiredRole={null}
                  />
                }
              />
              <Route
                path="/item/:id"
                element={
                  <ProtectedRoute
                    element={<ItemDetail />}
                    requiredRole={null}
                  />
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute
                    element={<Chat />}
                    requiredRole={null}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    element={<Profile />}
                    requiredRole={null}
                  />
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    element={<AdminDashboard />}
                    requiredRole="admin"
                  />
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {isAuthenticated && <Footer />}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;