// controllers/aiController.js
// AI Recommendation logic for employee performance analysis

// @desc    Generate AI recommendation for an employee or all employees
// @route   POST /api/ai/recommend
// @access  Private (requires JWT)
const getRecommendation = async (req, res) => {
  const { name, performanceScore, skills, department, experience } = req.body;

  // Validate input
  if (!name || performanceScore === undefined) {
    return res.status(400).json({ message: 'Employee name and performance score are required' });
  }

  const score = Number(performanceScore);

  try {
    // --- RECOMMENDATION LOGIC ---
    let recommendation = '';
    let training = '';
    let feedback = '';

    // 1. Promotion / Performance Recommendation based on score
    if (score > 85) {
      recommendation = 'Eligible for Promotion';
      feedback = 'Performance is excellent. Keep up the great work!';
    } else if (score >= 60 && score <= 85) {
      recommendation = 'Good Performance';
      feedback = 'Solid performance. Focus on advanced skills to grow further.';
    } else if (score >= 50 && score < 60) {
      recommendation = 'Average Performance';
      feedback = 'Performance is average. Set clear goals to improve your score.';
    } else {
      recommendation = 'Needs Improvement';
      feedback = 'Performance is below expectations. Immediate action is required.';
    }

    // 2. Training Suggestion based on skills and department
    const skillList = Array.isArray(skills) ? skills : [];

    if (skillList.length === 0) {
      training = 'Recommended Training: Core Skills Development Program';
    } else if (department && department.toLowerCase().includes('development')) {
      training = score > 70
        ? 'Recommended Training: Learn Advanced React & Node.js'
        : 'Recommended Training: JavaScript Fundamentals & Web Development Basics';
    } else if (department && department.toLowerCase().includes('data')) {
      training = score > 70
        ? 'Recommended Training: Advanced Machine Learning & AI'
        : 'Recommended Training: Python for Data Science Basics';
    } else if (department && department.toLowerCase().includes('design')) {
      training = 'Recommended Training: UI/UX Design with Figma';
    } else if (department && department.toLowerCase().includes('marketing')) {
      training = 'Recommended Training: Digital Marketing & SEO Strategy';
    } else if (department && department.toLowerCase().includes('hr')) {
      training = 'Recommended Training: HR Management & Employee Relations';
    } else {
      training = score > 70
        ? 'Recommended Training: Leadership & Project Management'
        : 'Recommended Training: Communication & Professional Development';
    }

    // 3. Experience-based additional note
    let experienceNote = '';
    if (Number(experience) < 1) {
      experienceNote = 'Assign a mentor to support onboarding.';
    } else if (Number(experience) >= 5 && score > 75) {
      experienceNote = 'Consider for a senior or lead role.';
    }

    // Build response object
    const result = {
      employee: name,
      performanceScore: score,
      recommendation,
      training,
      feedback,
      experienceNote: experienceNote || null,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ranked list of all employees with recommendations
// @route   POST /api/ai/rank
// @access  Private (requires JWT)
const getRankedEmployees = async (req, res) => {
  const { employees } = req.body;

  if (!employees || !Array.isArray(employees)) {
    return res.status(400).json({ message: 'Employees array is required' });
  }

  try {
    // Sort employees by performance score (descending) and add rank
    const ranked = [...employees]
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .map((emp, index) => {
        let badge = '';
        if (index === 0) badge = '🥇 Top Performer';
        else if (index === 1) badge = '🥈 Second Best';
        else if (index === 2) badge = '🥉 Third Best';

        let status = '';
        if (emp.performanceScore > 85) status = 'Eligible for Promotion';
        else if (emp.performanceScore >= 60) status = 'Good Performance';
        else if (emp.performanceScore >= 50) status = 'Average Performance';
        else status = 'Needs Improvement';

        return {
          rank: index + 1,
          name: emp.name,
          department: emp.department,
          performanceScore: emp.performanceScore,
          status,
          badge: badge || null,
        };
      });

    res.json({ rankedEmployees: ranked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendation, getRankedEmployees };
