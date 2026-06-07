/**
 * These enums mirror the Prisma schema definitions exactly.
 * They are re-exported here so they can be imported independently
 * of the generated Prisma client (useful for tests and type-only imports).
 *
 * At runtime, prefer importing from @prisma/client after running `prisma generate`.
 */

export enum UserRole {
  ADMIN = "ADMIN",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  TEAM_MEMBER = "MEMBER",
}

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
}

export enum TaskPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
