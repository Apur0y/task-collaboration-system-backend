import { Response, NextFunction } from "express";
import * as taskService from "../task/task.service";

import {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  TaskQueryInput,
} from "../task/task.validator";
import { AuthRequest } from "../../types";
import { sendSuccess } from "../../utils/response";

export const getTasksByProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as TaskQueryInput;
    const result = await taskService.getTasksByProject(
      req.params.projectId,
      query
    );
    sendSuccess(res, result.tasks, 200, {
      total: result.total,
      page: Number(query.page),
      limit: Number(query.limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    sendSuccess(res, task);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Inject projectId from route params if nested route
    const body: CreateTaskInput = {
      ...req.body,
      projectId: req.params.projectId ?? req.body.projectId,
    };
    const task = await taskService.createTask(body, req.user!);
    sendSuccess(res, task, 201);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.body as UpdateTaskInput,
      req.user!
    );
    sendSuccess(res, task);
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await taskService.updateTaskStatus(
      req.params.id,
      req.body as UpdateTaskStatusInput,
      req.user!
    );
    sendSuccess(res, task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await taskService.deleteTask(req.params.id, req.user!);
    sendSuccess(res, { message: "Task deleted successfully." });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comment = await taskService.addComment(
      req.params.id,
      req.body,
      req.user!
    );
    sendSuccess(res, comment, 201);
  } catch (err) {
    next(err);
  }
};

export const addAttachment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const attachment = await taskService.addAttachment(
      req.params.id,
      req.body,
      req.user!
    );
    sendSuccess(res, attachment, 201);
  } catch (err) {
    next(err);
  }
};
