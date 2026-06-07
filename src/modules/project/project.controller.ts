import { Response, NextFunction } from "express";
import * as projectService from "../project/project.service";
import { sendSuccess } from "../../utils/response";
import { AuthRequest } from "../../types";
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryInput,
} from "../project/project.validator";

export const getAllProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as ProjectQueryInput;
    const result = await projectService.getAllProjects(query, req.user!);
    sendSuccess(res, result.projects, 200, {
      total: result.total,
      page: Number(query.page),
      limit: Number(query.limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.createProject(
      req.body as CreateProjectInput,
      req.user!
    );
    sendSuccess(res, project, 201);
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.updateProject(
      req.params.id,
      req.body as UpdateProjectInput,
      req.user!
    );
    sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await projectService.deleteProject(req.params.id, req.user!);
    sendSuccess(res, { message: "Project deleted successfully." });
  } catch (err) {
    next(err);
  }
};

export const updateProjectMembers= async(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.updateProjectMembers(
      req.params.id,
      req.body,
      req.user!
    );
    sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};
