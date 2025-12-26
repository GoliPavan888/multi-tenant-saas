const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./utils/prisma");

const authMiddleware = require("./middlewares/auth.middleware");
const tenantResolver = require("./middlewares/tenant.middleware");

const authRoutes = require("./routes/auth.routes");
const tenantRoutes = require("./routes/tenant.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
const auditRoutes = require("./routes/audit.routes");
const superAdminRoutes = require("./routes/superAdmin.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   PUBLIC ROUTES (NO AUTH)
============================ */
app.use("/api/auth", authRoutes);

/* ============================
   HEALTH CHECK (NO AUTH, NO TENANT)
============================ */
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

/* ============================
   AUTHENTICATION (JWT)
============================ */
app.use(authMiddleware);

/* ============================
   SUPER ADMIN (NO TENANT)
============================ */
app.use("/api/super-admin", superAdminRoutes);

/* ============================
   TENANT RESOLUTION
============================ */
app.use(tenantResolver);

/* ============================
   TENANT-SCOPED ROUTES
============================ */
app.use("/api/tenants", tenantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", auditRoutes);

/* ============================
   START SERVER
============================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

