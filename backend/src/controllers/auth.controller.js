const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTER TENANT + TENANT ADMIN
 */
exports.registerTenant = async (req, res) => {
  try {
    const { tenantName, subdomain, email, password, fullName } = req.body;

    if (!tenantName || !subdomain || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const existingTenant = await prisma.tenant.findUnique({
      where: { subdomain }
    });

    if (existingTenant) {
      return res.status(409).json({
        success: false,
        message: "Tenant already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create tenant (defaults: free plan)
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        subdomain,
        subscriptionPlan: "free",
        status: "active"
      }
    });

    // ✅ Create tenant admin
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: "tenant_admin",
        tenantId: tenant.id
      }
    });

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: {
        tenantId: tenant.id,
        adminUser: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role
        }
      }
    });

  } catch (err) {
    console.error("Register tenant error:", err);
    return res.status(500).json({
      success: false,
      message: "Tenant registration failed"
    });
  }
};

/**
 * LOGIN (SUPER ADMIN + TENANT USERS)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          tenantId: user.tenantId
        },
        token,
        expiresIn: 86400
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

/**
 * GET CURRENT USER
 * GET /api/auth/me
 */
exports.me = async (req, res) => {
  try {
    const { userId, role } = req.user;

    // ✅ Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        tenantId: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let tenant = null;

if (user.tenantId) {
  console.log("ME user.tenantId:", user.tenantId);

  tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId }
  });

  console.log("ME tenant result:", tenant);
}


    // ✅ Fetch tenant (except for super_admin)
    if (user.tenantId) {
      tenant = await prisma.tenant.findUnique({
        where: { id: user.tenantId },
        select: {
          id: true,
          name: true,
          subdomain: true,
          subscriptionPlan: true,
          maxUsers: true,
          maxProjects: true
        }
      });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        tenant
      }
    });

  } catch (err) {
    console.error("Get current user error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
