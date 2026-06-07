import { Router } from "express";
import * as projectController from "../project/project.controller";

import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from "../project/project.validator";


// Import nested task routes
import taskRouter from "../task/task.routes";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { checkRole } from "../../middleware/checkRole";
import { UserRole } from "../../types/enums";

const router = Router();

// Mount nested task routes: /api/projects/:projectId/tasks
router.use("/:projectId/tasks", taskRouter);

/**
 * @route   GET /api/projects
 * @desc    List all projects with search, filter, pagination
 * @access  Authenticated
 */
router.get(
  "/",
  authenticate,
  validate(projectQuerySchema, "query"),
  projectController.getAllProjects
);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  ADMIN, PROJECT_MANAGER
 */
router.post(
  "/",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  validate(createProjectSchema),
  projectController.createProject
);

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID with progress percentage
 * @access  Authenticated
 */
router.get("/:id", authenticate, projectController.getProjectById);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  ADMIN, PROJECT_MANAGER (owner only for PM)
 */
router.put(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  validate(updateProjectSchema),
  projectController.updateProject
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  ADMIN, PROJECT_MANAGER (owner only for PM)
 */
router.delete(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  projectController.deleteProject
);

export default router;
