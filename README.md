# AI-Based Employee Performance Analytics & Recommendation System

A full-stack MERN application for tracking and analysing employee performance with AI-powered recommendations.

---

## Project Structure

```
ese_demo/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Signup & Login logic
│   │   ├── employeeController.js  # Employee CRUD
│   │   └── aiController.js        # AI recommendation logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Employee.js            # Employee schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── employeeRoutes.js      # /api/employees/*
│   │   └── aiRoutes.js            # /api/ai/*
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── EmployeeForm.jsx
    │   │   ├── EmployeeList.jsx
    │   │   └── AIRecommendation.jsx
    │   ├── services/
    │   │   └── api.js             # Axios instance + all API calls
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.jsx                # React Router setup
    │   └── main.jsx               # React entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup Instructions

### 1. Clone and enter the project
```bash
cd ese_demo
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Edit `.env` and fill in your values:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/employee_performance
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/auth/signup | Register user | No |
| POST | /api/auth/login | Login & get token | No |
| POST | /api/employees | Add employee | Yes |
| GET | /api/employees | Get all employees | Yes |
| GET | /api/employees/search | Search by name/dept | Yes |
| DELETE | /api/employees/:id | Delete employee | Yes |
| POST | /api/ai/recommend | Get AI recommendation | Yes |
| POST | /api/ai/rank | Rank all employees | Yes |

---

## AI Recommendation Logic

| Score | Status |
|-------|--------|
| > 85 | Eligible for Promotion |
| 60–85 | Good Performance |
| 50–59 | Average Performance |
| < 50 | Needs Improvement |
| No skills | Recommended Training |

---

## Deployment on Render

### Backend
- New Web Service → connect GitHub repo
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Add environment variables from `.env`

### Frontend
- New Static Site → connect GitHub repo
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Set `VITE_API_URL` to your backend Render URL

---

## Tech Stack

- **Frontend**: React.js, React Router v6, Axios, Vite, Plain CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT + bcryptjs
- **Database**: MongoDB Atlas
