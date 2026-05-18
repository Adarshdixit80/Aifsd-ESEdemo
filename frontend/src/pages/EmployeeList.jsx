// src/pages/EmployeeList.jsx
// Lists all employees with search and filter functionality

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/api';
import Navbar from '../components/Navbar';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

  // Search & filter state
  const [searchName, setSearchName] = useState('');
  const [filterDept, setFilterDept] = useState('');

  // Fetch all employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployees();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search by name and/or department
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchName.trim()) params.name = searchName.trim();
      if (filterDept.trim()) params.department = filterDept.trim();

      const response = await employeeService.searchEmployees(params);
      setEmployees(response.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset search filters and reload all employees
  const handleReset = () => {
    setSearchName('');
    setFilterDept('');
    fetchEmployees();
  };

  // Delete an employee
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await employeeService.deleteEmployee(id);
      setDeleteMsg(`${name} has been deleted.`);
      // Remove from local state without refetching
      setEmployees(employees.filter((e) => e._id !== id));
      setTimeout(() => setDeleteMsg(''), 3000);
    } catch (err) {
      setError('Failed to delete employee.');
    }
  };

  // Helper: get score badge class
  const getScoreClass = (score) => {
    if (score > 85) return 'score-high';
    if (score >= 60) return 'score-mid';
    return 'score-low';
  };

  // Get unique departments for the dropdown filter
  const allDepartments = [...new Set(employees.map((e) => e.department))];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Employee List</h1>
            <p>View, search and manage all registered employees</p>
          </div>
          <Link to="/add-employee" className="btn btn-primary">
            + Add Employee
          </Link>
        </div>

        {/* Alert Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {deleteMsg && <div className="alert alert-success">{deleteMsg}</div>}

        {/* Search & Filter Section */}
        <div className="card">
          <div className="card-title">Search & Filter</div>
          <div className="search-bar">
            {/* Search by Name */}
            <input
              type="text"
              id="search-name"
              placeholder="Search by employee name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {/* Filter by Department */}
            <select
              id="filter-dept"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {allDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
              {/* Static options in case list is empty */}
              {allDepartments.length === 0 && (
                <>
                  <option value="Development">Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                </>
              )}
            </select>

            {/* Search Button */}
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>

            {/* Reset Button */}
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="card">
          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <p>No employees found. <Link to="/add-employee">Add a new employee.</Link></p>
            </div>
          ) : (
            <>
              <div className="card-title">
                Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Skills</th>
                      <th>Score</th>
                      <th>Experience</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <tr key={emp._id}>
                        {/* Rank */}
                        <td>
                          <span className="rank-badge">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                        </td>

                        {/* Name */}
                        <td><strong>{emp.name}</strong></td>

                        {/* Email */}
                        <td style={{ fontSize: '13px', color: '#555' }}>{emp.email}</td>

                        {/* Department */}
                        <td>{emp.department}</td>

                        {/* Skills as tags */}
                        <td>
                          <div className="skills-container">
                            {emp.skills && emp.skills.length > 0 ? (
                              emp.skills.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                              ))
                            ) : (
                              <span style={{ color: '#aaa', fontSize: '13px' }}>—</span>
                            )}
                          </div>
                        </td>

                        {/* Performance Score with color badge */}
                        <td>
                          <span className={`score-badge ${getScoreClass(emp.performanceScore)}`}>
                            {emp.performanceScore}
                          </span>
                        </td>

                        {/* Experience */}
                        <td>{emp.experience} yr{emp.experience !== 1 ? 's' : ''}</td>

                        {/* Delete Action */}
                        <td>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 12px', fontSize: '13px' }}
                            onClick={() => handleDelete(emp._id, emp.name)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeList;
