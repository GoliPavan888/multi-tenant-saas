const prisma = require("../utils/prisma");

/**
 * Get all tenants (super_admin only)
 */
exports.getAllTenants = async (_req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      success: true,
      data: tenants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenants"
    });
  }
};

/**
 * Get single tenant by ID (super_admin only)
 */
exports.getTenantById = async (req, res) => {
  const { id } = req.params;

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id }
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    return res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenant"
    });
  }
};
