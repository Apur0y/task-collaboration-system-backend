import * as projectRepo from "../project/project.repository";
import * as activityRepo from "../activity/activity.repository";

import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryInput,
} from "../project/project.validator";
import { AuthPayload } from "../../types";
import { AppError } from "../../utils/AppError";
import { UserRole } from "../../types/enums";

export const getAllProjects = async (
  query: ProjectQueryInput,
  currentUser: AuthPayload
) => {
  return projectRepo.findAllProjects({
    ...query,
    userId: currentUser.userId,
    userRole: currentUser.role,
  });
};

export const getProjectById = async (id: string) => {
  const project = await projectRepo.findProjectById(id);
  if (!project) throw new AppError("Project not found.", 404);

  const progress = await projectRepo.getProjectProgress(id);

  return { ...project, progress };
};

export const createProject = async (
  input: CreateProjectInput,
  currentUser: AuthPayload
) => {
  const project = await projectRepo.createProject({
    ...input,
    ownerId: currentUser.userId,
  });

  await activityRepo.createActivityLog({
    action: `Project "${project.name}" was created.`,
    userId: currentUser.userId,
    projectId: project.id,
  });

  return project;
};

export const updateProject = async (
  id: string,
  input: UpdateProjectInput,
  currentUser: AuthPayload
) => {
  const project = await projectRepo.findProjectById(id);
  if (!project) throw new AppError("Project not found.", 404);

  // PM can only update their own projects (ADMIN bypasses at middleware)
  if (
    currentUser.role === UserRole.PROJECT_MANAGER &&
    project.ownerId !== currentUser.userId
  ) {
    throw new AppError("You can only update projects you own.", 403);
  }

  const updated = await projectRepo.updateProject(id, input);

  await activityRepo.createActivityLog({
    action: `Project "${updated.name}" was updated.`,
    userId: currentUser.userId,
    projectId: id,
  });

  return updated;
};

export const deleteProject = async (id: string, currentUser: AuthPayload) => {
  const project = await projectRepo.findProjectById(id);
  if (!project) throw new AppError("Project not found.", 404);

  if (
    currentUser.role === UserRole.PROJECT_MANAGER &&
    project.ownerId !== currentUser.userId
  ) {
    throw new AppError("You can only delete projects you own.", 403);
  }

  await activityRepo.createActivityLog({
    action: `Project "${project.name}" was deleted.`,
    userId: currentUser.userId,
    projectId: id,
  });

  return projectRepo.deleteProject(id);
};

export const updateProjectMembers = async (
  id: string,
  members: any,
  currentUser: AuthPayload
) => {
  const project = await projectRepo.findProjectById(id);
  if (!project) throw new AppError("Project not found.", 404);

  if (
    currentUser.role === UserRole.PROJECT_MANAGER &&
    project.ownerId !== currentUser.userId
  ) {
    throw new AppError("You can only update members of projects you own.", 403);
  }

  const updated = await projectRepo.updateProjectMembers(id, members);

  // await activityRepo.createActivityLog({
  //   action: `Members of project "${updated.name}" were updated.`,
  //   userId: currentUser.userId,
  //   projectId: id,
  // });

  return updated;
};
