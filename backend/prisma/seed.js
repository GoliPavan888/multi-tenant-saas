const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  /* =========================
     SUPER ADMIN (tenantId NULL)
     ========================= */
  const superAdminEmail = "superadmin@system.com";
  const superAdminPassword = await bcrypt.hash("Admin@123", 10);

  let superAdmin = await prisma.user.findFirst({
    where: {
      email: superAdminEmail,
      tenantId: null
    }
  });

  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: superAdminPassword,
        fullName: "System Super Admin",
        role: "super_admin",
        tenantId: null,
        isActive: true
      }
    });
    console.log("✅ Super admin created");
  } else {
    console.log("ℹ️ Super admin already exists");
  }

  /* =========================
     TENANT
     ========================= */
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "demo" },
    update: {},
    create: {
      name: "Demo Company",
      subdomain: "demo",
      subscriptionPlan: "pro",
      status: "active",
      maxUsers: 25,
      maxProjects: 15
    }
  });

  console.log("✅ Tenant created");

  /* =========================
     TENANT ADMIN
     ========================= */
  const adminPassword = await bcrypt.hash("Demo@123", 10);

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
      fullName: "Demo Admin",
      role: "tenant_admin",
      tenantId: tenant.id,
      isActive: true
    }
  });

  console.log("✅ Tenant admin created");

  /* =========================
     REGULAR USERS
     ========================= */
  const userPassword = await bcrypt.hash("User@123", 10);

  const users = [
    { email: "user1@demo.com", fullName: "User One" },
    { email: "user2@demo.com", fullName: "User Two" }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: u.email
        }
      },
      update: {},
      create: {
        email: u.email,
        password: userPassword,
        fullName: u.fullName,
        role: "user",
        tenantId: tenant.id,
        isActive: true
      }
    });
  }

  console.log("✅ Regular users created");

  /* =========================
     PROJECTS
     ========================= */
  const project1 = await prisma.project.create({
    data: {
      name: "Project Alpha",
      description: "First demo project",
      status: "active",
      tenantId: tenant.id,
      createdBy: tenantAdmin.id
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Project Beta",
      description: "Second demo project",
      status: "active",
      tenantId: tenant.id,
      createdBy: tenantAdmin.id
    }
  });

  console.log("✅ Projects created");

  /* =========================
     TASKS
     ========================= */
  await prisma.task.createMany({
    data: [
      {
        title: "Setup project",
        status: "todo",
        priority: "medium",
        tenantId: tenant.id,
        projectId: project1.id
      },
      {
        title: "Design database",
        status: "in_progress",
        priority: "high",
        tenantId: tenant.id,
        projectId: project1.id
      },
      {
        title: "Build API",
        status: "todo",
        priority: "high",
        tenantId: tenant.id,
        projectId: project2.id
      }
    ]
  });

  console.log("✅ Tasks created");
  console.log("🌱 Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
