/**
 * ============================================
 * Team Task Manager - Backend Server
 * ============================================
 * Main entry point for the Express.js server
 * Configures middleware, routes, and database connection
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ==================== Middleware ====================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==================== API Routes ====================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// ==================== Health Check ====================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Team Task Manager API is running!',
    timestamp: new Date().toISOString(),
  });
});

// ==================== Serve Frontend in Production ====================

const frontendIndexPath = path.join(__dirname, 'public', 'index.html');

if (fs.existsSync(frontendIndexPath)) {
  // Serve the built frontend copied by the production build step
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle React routing - return index.html for all non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
}

// ==================== Error Handler ====================

// Must be after all routes
app.use(errorHandler);

// ==================== Start Server ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ==========================================
  🚀 Team Task Manager Server Running
  ==========================================
  📡 Port:        ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  📋 API Base:    http://localhost:${PORT}/api
  ==========================================
  `);
});
