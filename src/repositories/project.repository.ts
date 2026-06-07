import prisma from "../config/database";
import { ProjectStatus } from "../types/enums";

export const findAllProjects = async (params: {
  status?: ProjectStatus;
  search?: string;
  page: number;
  limit: number;
  userId?: string;
  userRole?: string;
}) => {
  const { status, search, page, limit, userId, userRole } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    ...(status && { status }),
    ...(search && { name: { contains: search, mode: "insensitive" } }),
    ...(userRole === "TEAM_MEMBER" && {
      members: { some: { userId } },
    }),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true, members: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return { projects, total };
};

export const findProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
      },
      tasks: {
        include: {
          assignedMember: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

export const createProject = async (data: {
  name: string;
  description?: string;
  deadline: Date;
  status?: ProjectStatus;
  ownerId: string;
}) => {
  return prisma.project.create({
    data: {
      ...data,
      members: {
        create: { userId: data.ownerId },
      },
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });
};

export const updateProject = async (
  id: string,
  data: Partial<{
    name: string;
    description: string;
    deadline: Date;
    status: ProjectStatus;
  }>
) => {
  return prisma.project.update({ where: { id }, data });
};

export const deleteProject = async (id: string) => {
  return prisma.project.delete({ where: { id } });
};

export const getProjectProgress = async (id: string) => {
  const [total, completed] = await Promise.all([
    prisma.task.count({ where: { projectId: id } }),
    prisma.task.count({ where: { projectId: id, status: "COMPLETED" } }),
  ]);
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, progress };
};
