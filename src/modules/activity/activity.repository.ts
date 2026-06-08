import prisma from "../../config/database";

export const createActivityLog = async (data: {
  action: string;
  userId?: string;
  projectId?: string;
}) => {
  return prisma.activityLog.create({ data });
};

export const getRecentActivities = async (limit = 10) => {
  return prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true } },
      project: { select: { id: true, name: true } },
    },
  });
};
