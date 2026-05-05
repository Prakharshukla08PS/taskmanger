/**
 * Project Routes
 * Project CRUD and member management endpoints
 */
const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { projectValidation } = require('../validators/validators');

// All routes require authentication
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin-only routes
router.post('/', roleCheck('admin'), projectValidation, createProject);
router.put('/:id', roleCheck('admin'), projectValidation, updateProject);
router.delete('/:id', roleCheck('admin'), deleteProject);

// Member management (Admin only)
router.post('/:id/members', roleCheck('admin'), addMember);
router.delete('/:id/members/:userId', roleCheck('admin'), removeMember);

module.exports = router;
