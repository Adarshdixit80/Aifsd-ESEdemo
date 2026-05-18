// src/pages/EmployeeForm.jsx
// Form to register a new employee

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { employeeService } from '../services/api';
import Navbar from '../components/Navbar';

const EmployeeForm = () => {
  const navigate = useNavigate();

  // Form state - all fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',        // Entered as comma-separated string
    performanceScore: '',
    experience: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    const score = Number(formData.performanceScore);
    if (score < 0 || score > 100) {
      setError('Performance score must be between 0 and 100.');
      setLoading(false);
      return;
    }
    if (Number(formData.experience) < 0) {
      setError('Experience cannot be negative.');
      setLoading(false);
      return;
    }

    try {
      // Send data to backend
      await employeeService.addEmployee({
        ...formData,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
        // Skills sent as comma-separated string; backend will parse it
      });

      setSuccess('Employee registered successfully!');

      // Reset form after success
      setFormData({
        name: '',
        email: '',
        department: '',
        skills: '',
        performanceScore: '',
        experience: '',
      });

      // Redirect to employee list after 1.5 seconds
      setTimeout(() => navigate('/employees'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Register Employee</h1>
            <p>Add a new employee to the performance tracking system</p>
          </div>
          <Link to="/employees" className="btn btn-secondary">
            ← Back to List
          </Link>
        </div>

        {/* Alert Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Employee Registration Form */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Row 1: Name & Email */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="name">Employee Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@company.com"
                  required
                />
              </div>
            </div>

            {/* Row 2: Department */}
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Department --</option>
                <option value="Development">Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Management">Management</option>
              </select>
            </div>

            {/* Row 3: Skills */}
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
              />
              <span className="form-hint">Enter skills separated by commas</span>
            </div>

            {/* Row 4: Score & Experience */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="performanceScore">Performance Score * (0–100)</label>
                <input
                  type="number"
                  id="performanceScore"
                  name="performanceScore"
                  value={formData.performanceScore}
                  onChange={handleChange}
                  placeholder="e.g. 85"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="experience">Years of Experience *</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Saving...' : 'Register Employee'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmployeeForm;
