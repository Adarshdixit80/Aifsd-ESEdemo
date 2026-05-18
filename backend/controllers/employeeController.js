// controllers/employeeController.js
// CRUD operations for employee management

const Employee = require('../models/Employee');

// @desc    Add a new employee
// @route   POST /api/employees
// @access  Private (requires JWT)
const addEmployee = async (req, res) => {
  const { name, email, department, skills, performanceScore, experience } = req.body;

  // Validate required fields
  if (!name || !email || !department || performanceScore === undefined || experience === undefined) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    // Check for duplicate email
    const exists = await Employee.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    // Parse skills: accept comma-separated string or array
    let parsedSkills = skills;
    if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map((s) => s.trim()).filter((s) => s);
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills: parsedSkills || [],
      performanceScore: Number(performanceScore),
      experience: Number(experience),
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employees (sorted by performance score descending)
// @route   GET /api/employees
// @access  Private (requires JWT)
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ performanceScore: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search employees by department or name
// @route   GET /api/employees/search?department=Development&name=John
// @access  Private (requires JWT)
const searchEmployees = async (req, res) => {
  const { department, name } = req.query;

  // Build query object dynamically
  const query = {};
  if (department) {
    query.department = { $regex: department, $options: 'i' }; // case-insensitive search
  }
  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  try {
    const employees = await Employee.find(query).sort({ performanceScore: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private (requires JWT)
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private (requires JWT)
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addEmployee, getEmployees, searchEmployees, getEmployeeById, deleteEmployee };
