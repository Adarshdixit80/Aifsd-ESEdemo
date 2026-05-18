// src/components/Navbar.jsx
// Navigation bar component - shown on all protected pages

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Handle logout: clear storage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Brand / Logo */}
      <div className="navbar-brand">
        📊 EmpPerform
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/employees">Employees</Link></li>
        <li><Link to="/add-employee">Add Employee</Link></li>
        <li><Link to="/ai-recommend">AI Recommend</Link></li>

        {/* Show user name */}
        {user.name && (
          <li style={{ fontSize: '13px', color: '#888' }}>
            👤 {user.name}
          </li>
        )}

        <li>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
