import { Router } from "express";
import * as taskController from "../task/task.controller";

import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskQuerySchema,
  addCommentSchema,
  addAttachmentSchema,
} from "../task/task.validator";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../types/enums";
import { checkRole } from "../../middleware/checkRole";


// mergeParams: true allows access to parent router params (e.g., :projectId)
const router = Router({ mergeParams: true });

/**
 * @route   GET /api/projects/:projectId/tasks
 * @desc    List tasks for a project with advanced filtering
 * @access  Authenticated
 */
router.get(
  "/",
  authenticate,
  validate(taskQuerySchema, "query"),
  taskController.getTasksByProject
);

/**
 * @route   POST /api/projects/:projectId/tasks
 * @desc    Create a task within a project
 * @access  ADMIN, PROJECT_MANAGER
 */
router.post(
  "/",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  validate(createTaskSchema),
  taskController.createTask
);

/**
 * @route   GET /api/projects/:projectId/tasks/:id
 * @desc    Get a task by ID with comments and attachments
 * @access  Authenticated
 */
router.get("/:id", authenticate, taskController.getTaskById);

/**
 * @route   PUT /api/projects/:projectId/tasks/:id
 * @desc    Update a task (full update)
 * @access  ADMIN, PROJECT_MANAGER
 */
router.put(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  validate(updateTaskSchema),
  taskController.updateTask
);

/**
 * @route   PATCH /api/projects/:projectId/tasks/:id/status
 * @desc    Quick-update task status (TEAM_MEMBER can update their own tasks)
 * @access  Authenticated (all roles, RBAC enforced in service)
 */
router.patch(
  "/:id/status",
  authenticate,
  validate(updateTaskStatusSchema),
  taskController.updateTaskStatus
);

/**
 * @route   DELETE /api/projects/:projectId/tasks/:id
 * @desc    Delete a task
 * @access  ADMIN, PROJECT_MANAGER
 */
router.delete(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  taskController.deleteTask
);

/**
 * @route   POST /api/projects/:projectId/tasks/:id/comments
 * @desc    Add a comment to a task
 * @access  Authenticated
 */
router.post(
  "/:id/comments",
  authenticate,
  validate(addCommentSchema),
  taskController.addComment
);

/**
 * @route   POST /api/projects/:projectId/tasks/:id/attachments
 * @desc    Add an attachment to a task
 * @access  Authenticated
 */
router.post(
  "/:id/attachments",
  authenticate,
  validate(addAttachmentSchema),
  taskController.addAttachment
);

export default router;
