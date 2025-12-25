const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const logAudit = require("../utils/audit");

const USER_LIMITS = {
  free: 5,
  pro: 25,
  enterprise: 100
};

/**
 * CREATE USER
 * tenant_admin ONLY
 */
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;
  const { tenantId, userId, role: requesterRole } = req.user;

  if (requesterRole !== "tenant_admin") {
    return res.status(403).json({
      success: false,
      message: "Only tenant admins can create users"
    });
  }

  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Email, password, and role are required"
    });
  }

  if (!["tenant_admin", "user"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role"
    });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  });

  const userCount = await prisma.user.count({
    where: { tenantId }
  });

  if (userCount >= USER_LIMITS[tenant.plan]) {
    return res.status(403).json({
      success: false,
      message: "User limit exceeded for current plan"
    });
  }

  const existing = await prisma.user.findUnique({
    where: {
      tenantId_email: {
        tenantId,
        email
      }
    }
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "User already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      tenantId
    }
  });

  await logAudit({
    tenantId,
    userId,
    action: "CREATE",
    entity: "User",
    entityId: user.id
  });

  return res.status(201).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
};

/**
 * LIST USERS
 * tenant_admin ONLY
 */
exports.listUsers = async (req, res) => {
  const { tenantId, role } = req.user;

  if (role !== "tenant_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  const users = await prisma.user.findMany({
    where: { tenantId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  return res.json({
    success: true,
    data: users
  });
};

/**
 * DELETE USER
 * tenant_admin ONLY
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { tenantId, userId, role } = req.user;

  if (role !== "tenant_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  if (id === userId) {
    return res.status(400).json({
      success: false,
      message: "You cannot delete yourself"
    });
  }

  const user = await prisma.user.findFirst({
    where: { id, tenantId }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  await prisma.user.delete({
    where: { id }
  });

  await logAudit({
    tenantId,
    userId,
    action: "DELETE",
    entity: "User",
    entityId: id
  });

  return res.json({
    success: true,
    message: "User deleted"
  });
};
