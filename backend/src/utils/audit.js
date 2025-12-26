const prisma = require("./prisma");

module.exports = async function logAudit({
  tenantId = null,
  userId = null,
  action,
  entity,
  entityId = null
}) {
  try {
    await prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        entity,
        entityId
      }
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};
