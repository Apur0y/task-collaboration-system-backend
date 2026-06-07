import { PrismaClient, UserRole, ProjectStatus, TaskPriority, TaskStatus, ProjectRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 12);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      passwordHash,
      firstName: "Alice Admin",
      lastName:"Smith",
      role: UserRole.ADMIN,
    },
  });

  const pm = await prisma.user.create({
    data: {
      email: "pm@example.com",
      passwordHash,
      firstName: "Bob",
      lastName:"Manager",
      role: ProjectRole.MANAGER,
    },
  });

  const member1 = await prisma.user.create({
    data: {
      email: "member1@example.com",
      passwordHash,
      firstName: "Mem",
      lastName:"1",
      role: ProjectRole.MANAGER,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      email: "member2@example.com",
      passwordHash,
      firstName: "Bob Dev",
      lastName:"Sena",
      role: ProjectRole.MEMBER,
    },
  });

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: "E-Commerce Platform",
      description: "Build a full-stack e-commerce platform",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: ProjectStatus.ACTIVE,
      ownerId: pm.id,
      members: {
        create: [
          { userId: pm.id },
          { userId: member1.id },
          { userId: member2.id },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App Redesign",
      description: "Redesign the mobile application UI/UX",
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: ProjectStatus.ACTIVE,
      ownerId: admin.id,
      members: {
        create: [{ userId: admin.id }, { userId: member2.id }],
      },
    },
  });

  // Create Tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Setup API Infrastructure",
        description: "Initialize Node.js project with TypeScript",
        projectId: project1.id,
        assignedMemberId: member1.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: TaskPriority.HIGH,
        status: TaskStatus.COMPLETED,
      },
      {
        title: "Design Database Schema",
        description: "Create ERD and Prisma schema",
        projectId: project1.id,
        assignedMemberId: member1.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
      },
      {
        title: "Implement Authentication",
        description: "JWT-based auth with RBAC",
        projectId: project1.id,
        assignedMemberId: member2.id,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
      },
      {
        title: "Design Landing Page",
        description: "Create responsive landing page mockup",
        projectId: project2.id,
        assignedMemberId: member2.id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.IN_PROGRESS,
      },
      {
        title: "User Testing Plan",
        description: "Create test cases for new UI",
        projectId: project2.id,
        assignedMemberId: null,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
      },
    ],
  });

  // Seed activity logs
  await prisma.activityLog.createMany({
    data: [
      {
        action: `Project "E-Commerce Platform" was created.`,
        userId: pm.id,
        projectId: project1.id,
      },
      {
        action: `Project "Mobile App Redesign" was created.`,
        userId: admin.id,
        projectId: project2.id,
      },
      {
        action: `Task "Setup API Infrastructure" was assigned to ${member1.firstName} ${member1.lastName}.`,
        userId: pm.id,
        projectId: project1.id,
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log(`
  👤 Test Accounts (password: password123)
  ─────────────────────────────────────────
  Admin:   admin@example.com
  PM:      pm@example.com
  Member1: member1@example.com
  Member2: member2@example.com
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
