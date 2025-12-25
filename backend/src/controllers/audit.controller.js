const prisma = require("../utils/prisma");

exports.listAuditLogs = async (req, res) => {
  const { role, tenantId } = req.user;

  const logs = await prisma.auditLog.findMany({
    where: role === "super_admin" ? {} : { tenantId },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ success: true, data: logs });
};
