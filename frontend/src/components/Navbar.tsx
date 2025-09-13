import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: '#2c3e50',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginRight: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  };

  const buttonStyle = {
    ...linkStyle,
    backgroundColor: '#e74c3c',
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={{ ...linkStyle, fontSize: '1.5rem', fontWeight: 'bold' }}>
          EduX
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/universities" style={linkStyle}>Universities</Link>
            <Link to="/applications" style={linkStyle}>Applications</Link>
            {user?.is_staff && (
              <Link to="/admin-universities" style={linkStyle}>Manage Universities</Link>
            )}
          </>
        )}
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span style={{ color: 'white', marginRight: '1rem' }}>
              Welcome, {user?.first_name || user?.email}
            </span>
            <button onClick={handleLogout} style={buttonStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;