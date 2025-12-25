const prisma = require("../utils/prisma");
const logAudit = require("../utils/audit");
const PLAN_LIMITS = require("../utils/planLimits");

exports.createProject = async (req, res) => {
  const { name } = req.body;
  const { tenantId, userId, role } = req.user;

  if (role !== "tenant_admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (!name) {
    return res.status(400).json({ success: false, message: "Project name required" });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  });

  const projectCount = await prisma.project.count({
    where: { tenantId }
  });

  if (projectCount >= PLAN_LIMITS[tenant.plan].maxProjects) {
    return res.status(403).json({
      success: false,
      message: "Project limit exceeded for current plan"
    });
  }

  const project = await prisma.project.create({
    data: {
      name,
      tenantId
    }
  });

  await logAudit({
    tenantId,
    userId,
    action: "CREATE",
    entity: "Project",
    entityId: project.id
  });

  return res.status(201).json({ success: true, data: project });
};

exports.listProjects = async (req, res) => {
  const { tenantId } = req.user;

  const projects = await prisma.project.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ success: true, data: projects });
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user;

  const project = await prisma.project.findFirst({
    where: { id, tenantId },
    include: { tasks: true }
  });

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  return res.json({ success: true, data: project });
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const { tenantId, userId, role } = req.user;

  if (role !== "tenant_admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const project = await prisma.project.findFirst({
    where: { id, tenantId }
  });

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  await prisma.project.delete({ where: { id } });

  await logAudit({
    tenantId,
    userId,
    action: "DELETE",
    entity: "Project",
    entityId: id
  });

  return res.json({ success: true, message: "Project deleted" });
};
