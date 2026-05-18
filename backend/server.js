// server.js
// Main entry point for the backend server

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ---- Middleware ----
// Allow JSON request bodies
app.use(express.json());

// Enable CORS for frontend requests
app.use(
cors({
origin:
process.env.NODE_ENV === 'production'
? 'https://aifsd-esedemo.onrender.com'
: 'http://localhost:5173',
credentials: true,
})
);


// ---- Routes ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Employee Performance API is running...' });
});

// ---- Error Handling Middleware (must be last) ----
app.use(notFound);
app.use(errorHandler);

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
