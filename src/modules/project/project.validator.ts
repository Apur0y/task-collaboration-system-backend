import { z } from "zod";
import { ProjectStatus } from "../../types/enums";


const futureDate = z
  .string()
  .or(z.date())
  .transform((val) => new Date(val))
  .refine((date) => date > new Date(), {
    message: "Please select a valid deadline.",
  });

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required.").max(200),
  description: z.string().max(2000).optional(),
  deadline: futureDate,
  status: z.nativeEnum(ProjectStatus).optional(),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .extend({
    deadline: futureDate.optional(),
  });

export const projectQuerySchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  cursor: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
