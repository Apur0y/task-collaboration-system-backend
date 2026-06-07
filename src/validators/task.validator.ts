import { z } from "zod";
import { TaskPriority, TaskStatus } from "../types/enums";

const futureDate = z
  .string()
  .or(z.date())
  .transform((val) => new Date(val))
  .refine((date) => date > new Date(), {
    message: "Please select a valid deadline.",
  });

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required.").max(300),
  description: z.string().max(3000).optional(),
  projectId: z.string().uuid("Invalid project ID."),
  assignedMemberId: z.string().uuid("Invalid user ID.").optional().nullable(),
  dueDate: futureDate,
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
});

export const updateTaskSchema = createTaskSchema
  .omit({ projectId: true })
  .partial()
  .extend({
    dueDate: futureDate.optional(),
  });

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export const taskQuerySchema = z.object({
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedMember: z.string().uuid().optional(),
  deadlineStatus: z.literal("overdue").optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const addCommentSchema = z.object({
  text: z.string().min(1, "Comment text is required.").max(2000),
});

export const addAttachmentSchema = z.object({
  fileName: z.string().min(1, "File name is required."),
  fileUrl: z.string().url("Invalid file URL."),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
