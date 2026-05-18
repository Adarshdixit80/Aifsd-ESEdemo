// src/pages/AIRecommendation.jsx
// AI Recommendation page - analyze a single employee or rank all employees

import React, { useState, useEffect } from 'react';
import { employeeService, aiService } from '../services/api';
import Navbar from '../components/Navbar';

const AIRecommendation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [rankedList, setRankedList] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingRec, setLoadingRec] = useState(false);
  const [loadingRank, setLoadingRank] = useState(false);
  const [error, setError] = useState('');

  // Fetch all employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getEmployees();
        setEmployees(response.data);
      } catch (err) {
        setError('Failed to load employees.');
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  // Get AI recommendation for selected employee
  const handleGetRecommendation = async () => {
    if (!selectedEmployeeId) {
      setError('Please select an employee first.');
      return;
    }
    setError('');
    setRecommendation(null);
    setLoadingRec(true);

    // Find the selected employee object
    const emp = employees.find((e) => e._id === selectedEmployeeId);
    if (!emp) return;

    try {
      const response = await aiService.getRecommendation({
        name: emp.name,
        performanceScore: emp.performanceScore,
        skills: emp.skills,
        department: emp.department,
        experience: emp.experience,
      });
      setRecommendation(response.data);
    } catch (err) {
      setError('Failed to get recommendation. Try again.');
    } finally {
      setLoadingRec(false);
    }
  };

  // Get ranked list of all employees
  const handleGetRanking = async () => {
    setError('');
    setRankedList([]);
    setLoadingRank(true);

    try {
      const response = await aiService.getRankedEmployees({ employees });
      setRankedList(response.data.rankedEmployees);
    } catch (err) {
      setError('Failed to get rankings. Try again.');
    } finally {
      setLoadingRank(false);
    }
  };

  // Helper: determine card border color class based on recommendation
  const getRecClass = (rec) => {
    if (!rec) return '';
    if (rec.includes('Promotion')) return 'rec-eligible';
    if (rec.includes('Good')) return 'rec-good';
    if (rec.includes('Average')) return 'rec-average';
    return 'rec-needs';
  };

  // Helper: get score badge class
  const getScoreClass = (score) => {
    if (score > 85) return 'score-high';
    if (score >= 60) return 'score-mid';
    return 'score-low';
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>AI Recommendations</h1>
            <p>Get performance insights and ranking for your employees</p>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Section 1: Single Employee Recommendation */}
        <div className="card">
          <div className="card-title">Employee Recommendation</div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            Select an employee to get a personalized performance recommendation.
          </p>

          {loadingEmployees ? (
            <div className="loading">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="alert alert-info">
              No employees found. Please register employees first.
            </div>
          ) : (
            <>
              {/* Employee Dropdown */}
              <div className="form-group">
                <label htmlFor="emp-select">Select Employee</label>
                <select
                  id="emp-select"
                  value={selectedEmployeeId}
                  onChange={(e) => {
                    setSelectedEmployeeId(e.target.value);
                    setRecommendation(null);
                    setError('');
                  }}
                >
                  <option value="">-- Select an Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} — {emp.department} (Score: {emp.performanceScore})
                    </option>
                  ))}
                </select>
              </div>

              {/* Analyse Button */}
              <button
                className="btn btn-primary"
                onClick={handleGetRecommendation}
                disabled={loadingRec || !selectedEmployeeId}
              >
                {loadingRec ? 'Analysing...' : 'Get Recommendation'}
              </button>
            </>
          )}
        </div>

        {/* Recommendation Result Card */}
        {recommendation && (
          <div className={`recommendation-card ${getRecClass(recommendation.recommendation)}`}>
            <h3>Recommendation for {recommendation.employee}</h3>

            <p>
              <span className="label">Status: </span>
              {recommendation.recommendation}
            </p>

            <p>
              <span className="label">Performance Score: </span>
              <span className={`score-badge ${getScoreClass(recommendation.performanceScore)}`}>
                {recommendation.performanceScore}
              </span>
            </p>

            <p>
              <span className="label">Training: </span>
              {recommendation.training}
            </p>

            <p>
              <span className="label">Feedback: </span>
              {recommendation.feedback}
            </p>

            {recommendation.experienceNote && (
              <p>
                <span className="label">Note: </span>
                {recommendation.experienceNote}
              </p>
            )}
          </div>
        )}

        {/* Section 2: Employee Ranking */}
        <div className="card">
          <div className="card-title">Employee Rankings</div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            Rank all employees by performance score and see their status.
          </p>

          <button
            className="btn btn-success"
            onClick={handleGetRanking}
            disabled={loadingRank || employees.length === 0}
          >
            {loadingRank ? 'Ranking...' : 'Generate Rankings'}
          </button>

          {/* Ranked List */}
          {rankedList.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              {rankedList.map((emp) => (
                <div
                  key={emp.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  {/* Rank & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '180px' }}>
                    <span className="rank-badge" style={{ fontSize: '18px' }}>
                      {emp.badge ? emp.badge.split(' ')[0] : `#${emp.rank}`}
                    </span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{emp.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{emp.department}</div>
                    </div>
                  </div>

                  {/* Score */}
                  <span className={`score-badge ${getScoreClass(emp.performanceScore)}`}>
                    Score: {emp.performanceScore}
                  </span>

                  {/* Status */}
                  <span
                    style={{
                      fontSize: '13px',
                      color:
                        emp.status === 'Eligible for Promotion'
                          ? '#166534'
                          : emp.status === 'Good Performance'
                          ? '#1d4ed8'
                          : emp.status === 'Needs Improvement'
                          ? '#991b1b'
                          : '#92400e',
                      fontWeight: '500',
                    }}
                  >
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Logic Reference Card */}
        <div className="card">
          <div className="card-title">How AI Recommendations Work</div>
          <table>
            <thead>
              <tr>
                <th>Performance Score</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Above 85</td>
                <td><span style={{ color: '#166534', fontWeight: 600 }}>Eligible for Promotion</span></td>
              </tr>
              <tr>
                <td>60 – 85</td>
                <td><span style={{ color: '#1d4ed8', fontWeight: 600 }}>Good Performance</span></td>
              </tr>
              <tr>
                <td>50 – 59</td>
                <td><span style={{ color: '#92400e', fontWeight: 600 }}>Average Performance</span></td>
              </tr>
              <tr>
                <td>Below 50</td>
                <td><span style={{ color: '#991b1b', fontWeight: 600 }}>Needs Improvement</span></td>
              </tr>
              <tr>
                <td>No Skills listed</td>
                <td><span style={{ color: '#555', fontWeight: 600 }}>Recommended Training</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AIRecommendation;
