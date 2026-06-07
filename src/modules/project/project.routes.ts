import { Router } from "express";
import * as projectController from "../project/project.controller";

import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from "../project/project.validator";


import taskRouter from "../task/task.routes";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { checkRole } from "../../middleware/checkRole";
import { ProjectRole, UserRole } from "@prisma/client";

const router = Router();

router.use("/:projectId/tasks", taskRouter);


router.get(
  "/",
  authenticate,
  validate(projectQuerySchema, "query"),
  projectController.getAllProjects
);

router.post(
  "/",
  authenticate,
  checkRole([UserRole.ADMIN,ProjectRole.MANAGER, ProjectRole.OWNER,"USER"]),
  validate(createProjectSchema),
  projectController.createProject
);


router.get("/:id", authenticate, projectController.getProjectById);


router.put(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  validate(updateProjectSchema),
  projectController.updateProject
);


router.delete(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  projectController.deleteProject
);

export default router;
