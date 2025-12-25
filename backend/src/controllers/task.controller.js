const prisma = require("../utils/prisma");
const logAudit = require("../utils/audit");

const VALID_STATUSES = ["todo", "in_progress", "done"];

/**
 * CREATE TASK
 * tenant_admin only
 */
exports.createTask = async (req, res) => {
  const { title, projectId } = req.body;
  const { tenantId, userId, role } = req.user;

  if (role !== "tenant_admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (!title || !projectId) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, tenantId }
  });

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const task = await prisma.task.create({
    data: {
      title,
      status: "todo",
      tenantId,
      projectId
    }
  });

  await logAudit({
    tenantId,
    userId,
    action: "CREATE",
    entity: "Task",
    entityId: task.id
  });

  return res.status(201).json({ success: true, data: task });
};

/**
 * LIST TASKS BY PROJECT
 */
exports.listTasksByProject = async (req, res) => {
  const { projectId } = req.params;
  const { tenantId } = req.user;

  const project = await prisma.project.findFirst({
    where: { id: projectId, tenantId }
  });

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const tasks = await prisma.task.findMany({
    where: { projectId, tenantId },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ success: true, data: tasks });
};

/**
 * UPDATE TASK STATUS
 * tenant_admin → any task
 * user → only assigned tasks
 */
exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { tenantId, userId, role } = req.user;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task status"
    });
  }

  const task = await prisma.task.findFirst({
    where: { id, tenantId }
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  // RBAC enforcement
  if (role === "user" && task.assignedToId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden"
    });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { status }
  });

  await logAudit({
    tenantId,
    userId,
    action: "UPDATE",
    entity: "Task",
    entityId: id
  });

  return res.json({
    success: true,
    data: updatedTask
  });
};
