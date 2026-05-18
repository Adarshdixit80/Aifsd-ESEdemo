// src/App.jsx
// Root component — sets up routing for the entire application

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeList from './pages/EmployeeList';
import AIRecommendation from './pages/AIRecommendation';

// ProtectedRoute: redirects to /login if user is not authenticated
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // If no token found, redirect to login page
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes — require JWT token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-employee"
          element={
            <ProtectedRoute>
              <EmployeeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-recommend"
          element={
            <ProtectedRoute>
              <AIRecommendation />
            </ProtectedRoute>
          }
        />

        {/* Default: redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ color: '#1e3a5f' }}>404 — Page Not Found</h2>
              <p style={{ color: '#6b7280', marginTop: '8px' }}>
                The page you are looking for does not exist.
              </p>
              <a
                href="/dashboard"
                style={{
                  display: 'inline-block',
                  marginTop: '20px',
                  padding: '9px 20px',
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}
              >
                Go to Dashboard
              </a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
