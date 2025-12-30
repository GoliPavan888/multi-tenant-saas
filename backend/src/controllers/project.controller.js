const prisma = require("../utils/prisma");
const logAudit = require("../utils/audit");

/**
 * CREATE PROJECT
 * POST /api/projects
 * tenant_admin only
 */
exports.createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const { tenantId, userId, role } = req.user;

    // 🔒 RBAC
    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    // ✅ Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name required"
      });
    }

    // ✅ Fetch tenant
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    // ✅ Count existing projects
    const projectCount = await prisma.project.count({
      where: { tenantId }
    });

    // ✅ ENFORCE LIMIT FROM DATABASE (CORRECT)
    if (projectCount >= tenant.maxProjects) {
      return res.status(403).json({
        success: false,
        message: "Project limit reached"
      });
    }

    // ✅ Create project
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        status: status || "active",
        tenantId,
        createdBy: userId
      }
    });

    // ✅ Audit log
    await logAudit({
      tenantId,
      userId,
      action: "CREATE_PROJECT",
      entity: "project",
      entityId: project.id
    });

    return res.status(201).json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * LIST PROJECTS
 * GET /api/projects
 */
exports.listProjects = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const projects = await prisma.project.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    console.error("List projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * GET PROJECT BY ID
 * GET /api/projects/:id
 */
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const project = await prisma.project.findFirst({
      where: { id, tenantId },
      include: { tasks: true }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error("Get project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * DELETE PROJECT
 * DELETE /api/projects/:id
 * tenant_admin only
 */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, userId, role } = req.user;

    if (role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    const project = await prisma.project.findFirst({
      where: { id, tenantId }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await prisma.project.delete({
      where: { id }
    });

    await logAudit({
      tenantId,
      userId,
      action: "DELETE_PROJECT",
      entity: "project",
      entityId: id
    });

    return res.json({
      success: true,
      message: "Project deleted"
    });

  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
