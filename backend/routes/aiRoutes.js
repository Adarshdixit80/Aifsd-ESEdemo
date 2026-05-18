// routes/aiRoutes.js
// AI recommendation routes (all protected with JWT)

const express = require('express');
const router = express.Router();
const { getRecommendation, getRankedEmployees } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/recommend - Get recommendation for a single employee
router.post('/recommend', protect, getRecommendation);

// POST /api/ai/rank - Get ranked list of employees with statuses
router.post('/rank', protect, getRankedEmployees);

module.exports = router;
