/**
 * Task Controller
 * Handles task CRUD operations, status updates, and filtering
 */
const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private (Admin only)
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, assignedTo, project, dueDate } =
      req.body;

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo: assignedTo || null,
      project,
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    // Populate references for response
    await task.populate('assignedTo', 'name email');
    await task.populate('project', 'name');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks (with filtering)
 * @route   GET /api/tasks
 * @access  Private
 * @query   status, project, assignedTo
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, project, assignedTo } = req.query;
    let filter = {};

    // Apply filters
    if (status) filter.status = status;
    if (project) filter.project = project;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Members can only see their assigned tasks
    if (req.user.role === 'member') {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Members can only view their own tasks
    if (
      req.user.role === 'member' &&
      task.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this task',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private (Admin: full update, Member: status only)
 */
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Members can only update status of their own tasks
    if (req.user.role === 'member') {
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task',
        });
      }

      // Members can only update the status field
      const updateData = { status: req.body.status };
      task = await Task.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .populate('createdBy', 'name email');
    } else {
      // Admin can update everything
      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .populate('createdBy', 'name email');
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Admin only)
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard stats
 * @route   GET /api/tasks/stats/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    let filter = {};

    // Members only see their own stats
    if (req.user.role === 'member') {
      filter.assignedTo = req.user._id;
    }

    const [totalTasks, todoTasks, inProgressTasks, doneTasks, overdueTasks] =
      await Promise.all([
        Task.countDocuments(filter),
        Task.countDocuments({ ...filter, status: 'To Do' }),
        Task.countDocuments({ ...filter, status: 'In Progress' }),
        Task.countDocuments({ ...filter, status: 'Done' }),
        Task.countDocuments({
          ...filter,
          status: { $ne: 'Done' },
          dueDate: { $lt: new Date(), $ne: null },
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        overdueTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
};
