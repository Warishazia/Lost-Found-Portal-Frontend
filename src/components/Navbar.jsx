import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ onLogout, userRole }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/auth');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {}
        <Link to="/home" className="text-2xl font-bold">Lost & Found</Link>

        {}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/home" className="hover:text-accent transition">Home</Link>
          <Link to="/search" className="hover:text-accent transition">Search</Link>

          {userRole === 'student' && (
            <>
              <Link to="/post-lost" className="hover:text-accent transition">Post Lost</Link>
              <Link to="/post-found" className="hover:text-accent transition">Post Found</Link>
            </>
          )}

          {/* FIX: Chat and Profile accessible to both student and admin */}
          <Link to="/chat" className="hover:text-accent transition">Chat</Link>
          <Link to="/profile" className="hover:text-accent transition">Profile</Link>

          {userRole === 'admin' && (
            <Link to="/admin" className="hover:text-accent transition">Admin</Link>
          )}

          <button onClick={handleLogout} className="btn-outline">
            Logout
          </button>
        </div>

        {}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-primary flex flex-col gap-4 p-4 md:hidden z-50 shadow-lg">
            <Link to="/home" className="hover:text-accent" onClick={closeMenu}>Home</Link>
            <Link to="/search" className="hover:text-accent" onClick={closeMenu}>Search</Link>

            {userRole === 'student' && (
              <>
                <Link to="/post-lost" className="hover:text-accent" onClick={closeMenu}>Post Lost</Link>
                <Link to="/post-found" className="hover:text-accent" onClick={closeMenu}>Post Found</Link>
              </>
            )}

            <Link to="/chat" className="hover:text-accent" onClick={closeMenu}>Chat</Link>
            <Link to="/profile" className="hover:text-accent" onClick={closeMenu}>Profile</Link>

            {userRole === 'admin' && (
              <Link to="/admin" className="hover:text-accent" onClick={closeMenu}>Admin</Link>
            )}

            <button onClick={handleLogout} className="btn-outline w-full">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;