const prisma = require("../utils/prisma");

module.exports = async function tenantResolver(req, res, next) {
  try {
    const host = req.headers.host; // demo.localhost:5173
    if (!host) {
      return res.status(400).json({
        success: false,
        message: "Tenant not resolved"
      });
    }

    const subdomain = host.split(".")[0];

    // Ignore localhost without subdomain
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
