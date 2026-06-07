import * as taskRepo from "../task/task.repository";
import * as activityRepo from "../activity/activity.repository";
import * as authRepo from "../auth/auth.repository";
import { AppError } from "../../utils/AppError";
import { AuthPayload } from "../../types";
import {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  TaskQueryInput,
} from "../task/task.validator";
import { UserRole } from "../../types/enums";

export const getTasksByProject = async (
  projectId: string,
  query: TaskQueryInput
) => {
  return taskRepo.findTasksByProject(projectId, query);
};

export const getTaskById = async (id: string) => {
  const task = await taskRepo.findTaskById(id);
  if (!task) throw new AppError("Task not found.", 404);
  return task;
};

export const createTask = async (
  input: CreateTaskInput,
  currentUser: AuthPayload
) => {
  // Rule 1: No duplicate titles within same project
  const duplicate = await taskRepo.findTaskByTitleInProject(
    input.title,
    input.projectId
  );
  if (duplicate) {
    throw new AppError("This task already exists in the project.", 400);
  }

  const task = await taskRepo.createTask(input);

  let actionMsg = `Task "${task.title}" was created in project.`;
  if (input.assignedMemberId) {
    const assignee = await authRepo.findUserById(input.assignedMemberId);
    actionMsg = `Task "${task.title}" was assigned to ${assignee?.firstName ?? "a member"}.`;
  }

  await activityRepo.createActivityLog({
    action: actionMsg,
    userId: currentUser.userId,
    projectId: input.projectId,
  });

  return task;
};

export const updateTask = async (
  id: string,
  input: UpdateTaskInput,
  currentUser: AuthPayload
) => {
  const task = await taskRepo.findTaskById(id);
  if (!task) throw new AppError("Task not found.", 404);

  // Rule 3: Prevent updating completed tasks
  if (task.status === "COMPLETED") {
    throw new AppError("Completed tasks cannot be reassigned.", 400);
  }

  // Rule 1: No duplicate title if changing title
  if (input.title && input.title !== task.title) {
    const duplicate = await taskRepo.findTaskByTitleInProject(
      input.title,
      task.projectId,
      id
    );
    if (duplicate) {
      throw new AppError("This task already exists in the project.", 400);
    }
  }

  const updated = await taskRepo.updateTask(id, input);

  await activityRepo.createActivityLog({
    action: `Task "${updated.title}" was updated.`,
    userId: currentUser.userId,
    projectId: task.projectId,
  });

  return updated;
};

export const updateTaskStatus = async (
  id: string,
  input: UpdateTaskStatusInput,
  currentUser: AuthPayload
) => {
  const task = await taskRepo.findTaskById(id);
  if (!task) throw new AppError("Task not found.", 404);

  // TEAM_MEMBER can only update tasks assigned to them
  if (
    currentUser.role === UserRole.TEAM_MEMBER &&
    task.assignedMemberId !== currentUser.userId
  ) {
    throw new AppError(
      "You can only update the status of tasks assigned to you.",
      403
    );
  }

  // Rule 3: Cannot change status of already-completed task (re-open)
  if (task.status === "COMPLETED" && input.status !== "COMPLETED") {
    throw new AppError("Completed tasks cannot be reassigned.", 400);
  }

  const updated = await taskRepo.updateTask(id, { status: input.status });

  await activityRepo.createActivityLog({
    action: `Task "${task.title}" status changed to ${input.status}.`,
    userId: currentUser.userId,
    projectId: task.projectId,
  });

  return updated;
};

export const deleteTask = async (id: string, currentUser: AuthPayload) => {
  const task = await taskRepo.findTaskById(id);
  if (!task) throw new AppError("Task not found.", 404);

  await activityRepo.createActivityLog({
    action: `Task "${task.title}" was deleted.`,
    userId: currentUser.userId,
    projectId: task.projectId,
  });

  return taskRepo.deleteTask(id);
};

export const addComment = async (
  taskId: string,
  input: { text: string },
  currentUser: AuthPayload
) => {
  const task = await taskRepo.findTaskById(taskId);
  if (!task) throw new AppError("Task not found.", 404);

  return taskRepo.addComment({
    text: input.text,
    taskId,
    userId: currentUser.userId,
  });
};

export const addAttachment = async (
  taskId: string,
  input: { fileName: string; fileUrl: string },
  currentUser: AuthPayload
) => {
  const task = await taskRepo.findTaskById(taskId);
  if (!task) throw new AppError("Task not found.", 404);

  const attachment = await taskRepo.addAttachment({
    ...input,
    taskId,
    uploadedById: currentUser.userId,
  });

  await activityRepo.createActivityLog({
    action: `Attachment "${input.fileName}" was added to task "${task.title}".`,
    userId: currentUser.userId,
    projectId: task.projectId,
  });

  return attachment;
};
