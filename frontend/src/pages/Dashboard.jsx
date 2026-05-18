// src/pages/Dashboard.jsx
// Main dashboard showing employee statistics summary

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getEmployees();
        setEmployees(response.data);
      } catch (err) {
        setError('Failed to load employee data.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Calculate statistics from employee data
  const totalEmployees = employees.length;
  const avgScore =
    totalEmployees > 0
      ? (employees.reduce((sum, e) => sum + e.performanceScore, 0) / totalEmployees).toFixed(1)
      : 0;
  const topPerformer = employees.length > 0 ? employees[0] : null; // sorted desc by score
  const needsImprovement = employees.filter((e) => e.performanceScore < 50).length;

  // Get unique departments
  const departments = [...new Set(employees.map((e) => e.department))];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.name || 'Manager'}! Here's your overview.</p>
          </div>
          <Link to="/add-employee" className="btn btn-primary">
            + Add Employee
          </Link>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading */}
        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : (
          <>
            {/* Summary Statistics */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{totalEmployees}</div>
                <div className="stat-label">Total Employees</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{avgScore}</div>
                <div className="stat-label">Avg Performance Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{departments.length}</div>
                <div className="stat-label">Departments</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#dc2626' }}>
                  {needsImprovement}
                </div>
                <div className="stat-label">Needs Improvement</div>
              </div>
            </div>

            {/* Top Performer */}
            {topPerformer && (
              <div className="card">
                <div className="card-title">🏆 Top Performer</div>
                <p>
                  <strong>{topPerformer.name}</strong> — {topPerformer.department} &nbsp;
                  <span className="score-badge score-high">
                    Score: {topPerformer.performanceScore}
                  </span>
                </p>
                <p style={{ marginTop: 8, fontSize: '13px', color: '#6b7280' }}>
                  Skills: {topPerformer.skills.join(', ') || 'N/A'}
                </p>
              </div>
            )}

            {/* Quick Links */}
            <div className="card">
              <div className="card-title">Quick Actions</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/employees" className="btn btn-secondary">
                  View All Employees
                </Link>
                <Link to="/add-employee" className="btn btn-primary">
                  Register Employee
                </Link>
                <Link to="/ai-recommend" className="btn btn-success">
                  AI Recommendations
                </Link>
              </div>
            </div>

            {/* Recent Employees Table */}
            <div className="card">
              <div className="card-title">Recent Employees</div>
              {employees.length === 0 ? (
                <div className="empty-state">
                  <p>No employees registered yet. <Link to="/add-employee">Add one now.</Link></p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Score</th>
                        <th>Experience</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Show latest 5 employees */}
                      {employees.slice(0, 5).map((emp) => (
                        <tr key={emp._id}>
                          <td>{emp.name}</td>
                          <td>{emp.department}</td>
                          <td>
                            <span
                              className={`score-badge ${
                                emp.performanceScore > 85
                                  ? 'score-high'
                                  : emp.performanceScore >= 60
                                  ? 'score-mid'
                                  : 'score-low'
                              }`}
                            >
                              {emp.performanceScore}
                            </span>
                          </td>
                          <td>{emp.experience} yrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
