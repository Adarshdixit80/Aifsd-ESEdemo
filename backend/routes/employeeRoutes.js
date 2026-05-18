// routes/employeeRoutes.js
// Employee CRUD and search routes (all protected with JWT)

const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  searchEmployees,
  getEmployeeById,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// GET  /api/employees/search?department=Development&name=John
router.get('/search', protect, searchEmployees);

// GET  /api/employees       - Get all employees
// POST /api/employees       - Add new employee
router.route('/').get(protect, getEmployees).post(protect, addEmployee);

// GET    /api/employees/:id - Get single employee
// DELETE /api/employees/:id - Delete employee
router.route('/:id').get(protect, getEmployeeById).delete(protect, deleteEmployee);

module.exports = router;
