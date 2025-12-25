const prisma = require("../utils/prisma");

/**
 * LIST ALL TENANTS
 */
exports.listTenants = async (req, res) => {
  const tenants = await prisma.tenant.findMany({
    select: {
      id: true,
      name: true,
      subdomain: true,
      plan: true,
      status: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ success: true, data: tenants });
};

/**
 * LIST USERS FOR A TENANT (READ-ONLY)
 */
exports.listUsersByTenant = async (req, res) => {
  const { tenantId } = req.params;

  const users = await prisma.user.findMany({
    where: { tenantId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  return res.json({ success: true, data: users });
};

/**
 * LIST PROJECTS FOR A TENANT (READ-ONLY)
 */
exports.listProjectsByTenant = async (req, res) => {
  const { tenantId } = req.params;

  const projects = await prisma.project.findMany({
    where: { tenantId },
    select: {
      id: true,
      name: true,
      createdAt: true
    }
  });

  return res.json({ success: true, data: projects });
};
