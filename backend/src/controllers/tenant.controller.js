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
/**
 * Update tenant (super_admin only)
 */
exports.updateTenant = async (req, res) => {
  const { id } = req.params;
  const { subscriptionPlan, status, maxUsers, maxProjects, name } = req.body;

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

    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(subscriptionPlan && { subscriptionPlan }),
        ...(status && { status }),
        ...(maxUsers !== undefined && { maxUsers }),
        ...(maxProjects !== undefined && { maxProjects })
      }
    });

    return res.json({
      success: true,
      message: "Tenant updated successfully",
      data: updatedTenant
    });
  } catch (error) {
    console.error("Update tenant error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tenant"
    });
  }
};
const bcrypt = require("bcrypt");

/**
 * Create tenant by super admin
 */
exports.createTenantByAdmin = async (req, res) => {
  const {
    name,
    subdomain,
    subscriptionPlan = "free",
    adminEmail,
    adminPassword,
    adminFullName
  } = req.body;

  try {
    // check subdomain
    const existing = await prisma.tenant.findUnique({
      where: { subdomain }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Subdomain already exists"
      });
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name,
          subdomain,
          subscriptionPlan,
          status: "active"
        }
      });

      const admin = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: adminEmail,
          passwordHash,
          fullName: adminFullName,
          role: "tenant_admin",
          isActive: true
        }
      });

      return { tenant, admin };
    });

    return res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data: result
    });
  } catch (error) {
    console.error("Create tenant by admin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tenant"
    });
  }
};
