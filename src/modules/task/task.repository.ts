import prisma from "../../config/database";
import { TaskPriority, TaskStatus } from "../../types/enums";

export const findTasksByProject = async (
  projectId: string,
  params: {
    priority?: TaskPriority;
    status?: TaskStatus;
    assignedMember?: string;
    deadlineStatus?: "overdue";
    page: number;
    limit: number;
  }
) => {
  const { priority, status, assignedMember, deadlineStatus, page, limit } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    projectId,
    ...(priority && { priority }),
    ...(status && { status }),
    ...(assignedMember && { assignedMemberId: assignedMember }),
    ...(deadlineStatus === "overdue" && {
      dueDate: { lt: new Date() },
      status: { not: "COMPLETED" },
    }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        assignedMember: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true, attachments: true } },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return { tasks, total };
};

export const findTaskById = async (id: string) => {
  return prisma.task.findUnique({
    where: { id },
    include: {
      assignedMember: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, name: true } },
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
      attachments: {
        include: { uploadedBy: { select: { id: true, name: true } } },
      },
    },
  });
};

export const findTaskByTitleInProject = async (
  title: string,
  projectId: string,
  excludeId?: string
) => {
  return prisma.task.findFirst({
    where: {
      title: { equals: title, mode: "insensitive" },
      projectId,
      ...(excludeId && { id: { not: excludeId } }),
    },
  });
};

export const createTask = async (data: {
  title: string;
  description?: string;
  projectId: string;
  assignedMemberId?: string | null;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
}) => {
  return prisma.task.create({
    data,
    include: {
      assignedMember: { select: { id: true, name: true, email: true } },
    },
  });
};

export const updateTask = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    assignedMemberId: string | null;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
  }>
) => {
  return prisma.task.update({ where: { id }, data });
};

export const deleteTask = async (id: string) => {
  return prisma.task.delete({ where: { id } });
};

export const addComment = async (data: {
  text: string;
  taskId: string;
  userId: string;
}) => {
  return prisma.comment.create({
    data,
    include: { user: { select: { id: true, name: true } } },
  });
};

export const addAttachment = async (data: {
  fileName: string;
  fileUrl: string;
  taskId: string;
  uploadedById: string;
}) => {
  return prisma.attachment.create({
    data,
    include: { uploadedBy: { select: { id: true, name: true } } },
  });
};
