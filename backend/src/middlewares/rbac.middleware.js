module.exports = function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};
