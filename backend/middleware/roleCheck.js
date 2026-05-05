/**
 * Role Check Middleware
 * Restricts access based on user roles
 * Usage: roleCheck('admin') or roleCheck('admin', 'member')
 */
const roleCheck = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized for this action.`,
      });
    }
    next();
  };
};

module.exports = { roleCheck };
