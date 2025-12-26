const prisma = require("../utils/prisma");

module.exports = async function tenantResolver(req, res, next) {
  try {
    // 🔥 1. SUPER ADMIN BYPASS
    if (req.user && req.user.role === "super_admin") {
      return next();
    }

    // 🔥 2. JWT-BASED TENANT (PRIMARY METHOD)
    if (req.user && req.user.tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: req.user.tenantId }
      });

      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found"
        });
      }

      req.tenant = tenant;
      return next();
    }

    // 🔥 3. OPTIONAL: Subdomain fallback (ONLY if needed)
    const host = req.headers.host;
    if (!host) {
      return res.status(400).json({
        success: false,
        message: "Tenant not resolved"
      });
    }

    const subdomain = host.split(".")[0];

    if (subdomain === "localhost" || subdomain === "127") {
      return res.status(400).json({
        success: false,
        message: "Tenant subdomain required"
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { subdomain }
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resolve tenant"
    });
  }
};
