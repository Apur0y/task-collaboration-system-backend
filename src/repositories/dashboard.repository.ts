import prisma from "../config/database";

export const getDashboardStats = async (
  userId?: string,
  userRole?: string
) => {
  const projectWhere =
    userRole === "TEAM_MEMBER"
      ? { members: { some: { userId } } }
      : {};

  const taskWhere =
    userRole === "TEAM_MEMBER"
      ? { project: { members: { some: { userId } } } }
      : {};

  const now = new Date();

  const [
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    tasksByPriority,
    tasksByStatus,
    teamWorkload,
  ] = await Promise.all([
    prisma.project.count({ where: projectWhere }),
    prisma.task.count({ where: taskWhere }),
    prisma.task.count({ where: { ...taskWhere, status: "COMPLETED" } }),
    prisma.task.count({
      where: { ...taskWhere, dueDate: { lt: now }, status: { not: "COMPLETED" } },
    }),
    prisma.task.groupBy({
      by: ["priority"],
      where: taskWhere,
      _count: { priority: true },
    }),
    prisma.task.groupBy({
      by: ["status"],
      where: taskWhere,
      _count: { status: true },
    }),
    prisma.user.findMany({
      where: { role: "TEAM_MEMBER" },
      select: {
        id: true,
        name: true,
        email: true,
        assignedTasks: { select: { status: true } },
      },
    }),
  ]);

  const pendingTasks = totalTasks - completedTasks;

  type WorkloadMember = (typeof teamWorkload)[number];
  type GroupByResult = { _count: Record<string, number>; priority?: string; status?: string };

  const workloadSummary = teamWorkload.map((member: WorkloadMember) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    total: member.assignedTasks.length,
    completed: member.assignedTasks.filter((t: { status: string }) => t.status === "COMPLETED").length,
    pending: member.assignedTasks.filter((t: { status: string }) => t.status !== "COMPLETED").length,
  }));

  return {
    counts: { totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks },
    charts: {
      tasksByPriority: (tasksByPriority as GroupByResult[]).map((g) => ({
        priority: g.priority,
        count: g._count["priority"],
      })),
      tasksByStatus: (tasksByStatus as GroupByResult[]).map((g) => ({
        status: g.status,
        count: g._count["status"],
      })),
    },
    workloadSummary,
  };
};
