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
import { ProjectRole } from "@prisma/client";


const router = Router({ mergeParams: true });


router.get(
  "/project/:projectId",
  authenticate,
  validate(taskQuerySchema, "query"),
  taskController.getTasksByProjectDirect
);

router.get(
  "/",
  authenticate,
  validate(taskQuerySchema, "query"),
  taskController.getTasksByProject
);


router.post(
  "/",
  authenticate,
  checkRole([UserRole.ADMIN, ProjectRole.MANAGER]),
  validate(createTaskSchema),
  taskController.createTask
);


router.get("/:id", authenticate, taskController.getTaskById);


router.put(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN, ProjectRole.MANAGER]),
  validate(updateTaskSchema),
  taskController.updateTask
);


router.patch(
  "/:id/status",
  authenticate,
  validate(updateTaskStatusSchema),
  taskController.updateTaskStatus
);

router.delete(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN, ProjectRole.MANAGER]),
  taskController.deleteTask
);

router.post(
  "/:id/comments",
  authenticate,
  validate(addCommentSchema),
  taskController.addComment
);

router.post(
  "/:id/attachments",
  authenticate,
  validate(addAttachmentSchema),
  taskController.addAttachment
);

export default router;
