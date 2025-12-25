module.exports = (req, res, next) => {
  const { role, tenantId } = req.user;

  if (role !== "super_admin" || tenantId !== null) {
    return res.status(403).json({
      success: false,
      message: "Super admin access only"
    });
  }

  next();
};
