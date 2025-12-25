const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. SUPER ADMIN (tenantId = null)
  const superAdminPassword = await bcrypt.hash("Admin@123", 10);

const existingSuperAdmin = await prisma.user.findFirst({
  where: {
    email: "superadmin@system.com",
    tenantId: null
  }
});

if (!existingSuperAdmin) {
  await prisma.user.create({
    data: {
      email: "superadmin@system.com",
      password: superAdminPassword,
      role: "super_admin",
      tenantId: null
    }
  });
}

  console.log("✅ Super admin created");

  // 2. TENANT
  const tenant = await prisma.tenant.create({
    data: {
      name: "Demo Organization",
      subdomain: "demo",
      plan: "pro",
      status: "active"
    }
  });

  console.log("✅ Demo tenant created");

  // 3. TENANT ADMIN
  const adminPassword = await bcrypt.hash("Admin@123", 10);

  const tenantAdmin = await prisma.user.create({
    data: {
      email: "admin@demo.com",
      password: adminPassword,
      role: "tenant_admin",
      tenantId: tenant.id
    }
  });

  console.log("✅ Tenant admin created");

  // 4. PROJECT
  const project = await prisma.project.create({
    data: {
      name: "Demo Project",
      tenantId: tenant.id
    }
  });

  console.log("✅ Project created");

  // 5. TASK
  await prisma.task.create({
    data: {
      title: "Initial Task",
      status: "todo",
      projectId: project.id,
      tenantId: tenant.id
    }
  });

  console.log("✅ Task created");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
