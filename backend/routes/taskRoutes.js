/**
 * Task Routes
 * Task CRUD, status updates, and dashboard stats endpoints
 */
const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const {
  taskValidation,
  taskUpdateValidation,
} = require('../validators/validators');

// All routes require authentication
router.use(protect);

// Dashboard stats (must be before /:id route)
router.get('/stats/dashboard', getDashboardStats);

// Routes accessible by all authenticated users
router.get('/', getTasks);
router.get('/:id', getTaskById);

// Update task (Admin: full update, Member: status only)
router.put('/:id', taskUpdateValidation, updateTask);

// Admin-only routes
router.post('/', roleCheck('admin'), taskValidation, createTask);
router.delete('/:id', roleCheck('admin'), deleteTask);

module.exports = router;
