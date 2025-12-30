const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const logAudit = require("../utils/audit");

/**
 * CREATE USER
 * POST /api/tenants/:tenantId/users
 * tenant_admin only
 */
exports.createUser = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { userId, role } = req.user;
    const { email, password, fullName, role: newUserRole } = req.body;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "email, password and fullName are required"
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    const userCount = await prisma.user.count({
      where: { tenantId }
    });

    if (userCount >= tenant.maxUsers) {
      return res.status(403).json({
        success: false,
        message: "Subscription user limit reached"
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { tenantId, email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists in this tenant"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: newUserRole || "user",
        tenantId
      }
    });

    await logAudit({
      tenantId,
      userId,
      action: "CREATE_USER",
      entity: "user",
      entityId: user.id
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * LIST USERS
 * GET /api/tenants/:tenantId/users
 */
exports.listUsers = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const users = await prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error("List users error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * DELETE USER
 * DELETE /api/tenants/users/:userId
 * tenant_admin only
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const { userId, role, tenantId } = req.user;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if (userId === targetUserId) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete yourself"
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: targetUserId, tenantId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await prisma.user.delete({
      where: { id: targetUserId }
    });

    await logAudit({
      tenantId,
      userId,
      action: "DELETE_USER",
      entity: "user",
      entityId: targetUserId
    });

    return res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
