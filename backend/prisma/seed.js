const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  /* =========================
     1. SUPER ADMIN
  ========================= */
 const superAdminPassword = await bcrypt.hash("Admin@123", 10);

let superAdmin = await prisma.user.findFirst({
  where: {
    email: "superadmin@system.com",
    tenantId: null
  }
});

if (!superAdmin) {
  superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@system.com",
      password: superAdminPassword,
      role: "super_admin",
      tenantId: null
    }
  });
}

console.log("✅ Super admin ready");

  /* =========================
     2. TENANT
  ========================= */
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "demo" },
    update: {},
    create: {
      name: "Demo Organization",
      subdomain: "demo",
      plan: "pro",
      status: "active"
    }
  });

  console.log("✅ Demo tenant ready");

  /* =========================
     3. TENANT ADMIN
  ========================= */
  const adminPassword = await bcrypt.hash("Admin@123", 10);

  const tenantAdmin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: "admin@demo.com"
      }
    },
    update: {},
    create: {
      email: "admin@demo.com",
      password: adminPassword,
      role: "tenant_admin",
      tenantId: tenant.id
    }
  });

  console.log("✅ Tenant admin ready");

  /* =========================
     4. PROJECT
  ========================= */
  let project = await prisma.project.findFirst({
    where: {
      name: "Demo Project",
      tenantId: tenant.id
    }
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: "Demo Project",
        tenantId: tenant.id
      }
    });
  }

  console.log("✅ Project ready");

  /* =========================
     5. TASK
  ========================= */
  const existingTask = await prisma.task.findFirst({
    where: {
      title: "Initial Task",
      projectId: project.id
    }
  });

  if (!existingTask) {
    await prisma.task.create({
      data: {
        title: "Initial Task",
        status: "todo",
        projectId: project.id,
        tenantId: tenant.id
      }
    });
  }

  console.log("✅ Task ready");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
