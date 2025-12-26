const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTER TENANT + TENANT ADMIN
 */
exports.registerTenant = async (req, res) => {
  try {
    const { tenantName, subdomain, email, password } = req.body;

    if (!tenantName || !subdomain || !email || !password) {
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

    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        subdomain,
        plan: "free",
        status: "active"
      }
    });

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "tenant_admin",
        tenantId: tenant.id
      }
    });

    return res.status(201).json({
      success: true,
      data: {
        tenantId: tenant.id,
        adminId: admin.id
      }
    });
  } catch (err) {
    console.error(err);
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

    // SUPER ADMIN
    if (user.role === "super_admin") {
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          tenantId: null
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        data: { token, role: user.role }
      });
    }

    // TENANT USER
    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      data: { token, role: user.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

/**
 * CURRENT USER
 */
exports.me = async (req, res) => {
  const { userId, tenantId, role } = req.user;

  return res.json({
    success: true,
    data: {
      userId,
      tenantId,
      role
    }
  });
};
