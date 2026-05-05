# Team Task Manager

A full-stack production-ready web application for teams to manage projects and track tasks with role-based access control.

## 🚀 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite, React Router DOM, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Auth
- **Deployment Ready:** Configured for seamless deployment on Railway

## 🔐 Core Features

- **Authentication:** JWT-based user login and registration with bcrypt password hashing
- **Role-Based Access:** 
  - **Admin:** Create projects, manage users, create and delete tasks
  - **Member:** View assigned projects and tasks, update task status
- **Project Management:** Create, view, and manage projects
- **Task Management:** Assign tasks, set due dates, update statuses (To Do, In Progress, Done)
- **Dashboard:** At-a-glance overview of task statistics including overdue tracking

## 📁 Project Structure

```text
team-task-manager/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # API request handlers
│   ├── middleware/      # JWT Auth and Error handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API routes
│   ├── validators/      # express-validator rules
│   ├── server.js        # Main entry point
│   └── .env.example     # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components (Layout, Sidebar)
    │   ├── context/     # React Context for global state (Auth)
    │   ├── pages/       # Route pages (Login, Dashboard, Tasks, Projects)
    │   ├── services/    # Axios API configuration
    │   ├── App.jsx      # Main router configuration
    │   └── main.jsx     # React entry point
    └── tailwind.config.js
```

## 🛠️ Step-by-Step Setup Guide

### 1. Prerequisites
- Node.js (v16+)
- MongoDB connection string (Local or MongoDB Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
```
- Copy `.env.example` to `.env` and fill in your MongoDB URI and a secure JWT secret:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
- Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173`

## 🌍 Deployment on Railway

This app is ready to be deployed on Railway!

1. Create a new project on Railway.
2. Provision a **MongoDB** database in your Railway project.
3. Connect your GitHub repository containing this code.
4. Set the service root directory to the repository root, not `backend/`.
5. Use `npm run build` as the build command and `npm start` as the start command.
6. In your Railway service settings, add the environment variables matching the `.env` file (using the internal Railway MongoDB URL).
7. Deploy!

*Note: The `server.js` file is already configured to serve the static built React frontend when `NODE_ENV=production`.*
