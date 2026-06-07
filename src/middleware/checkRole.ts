import { Response, NextFunction } from "express";
import { UserRole } from "../types/enums";
import { AuthRequest } from "../types";
import { AppError } from "../utils/AppError";

/**
 * Flexible RBAC middleware factory.
 * Usage: checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER])
 *
 * Role Hierarchy:
 *  - ADMIN: Full bypass access.
 *  - PROJECT_MANAGER: Can create/manage their own projects and tasks.
 *  - TEAM_MEMBER: Read-only on assigned projects; can only update task status.
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Unauthorized. Please authenticate.", 401));
    }

    // ADMIN always has access
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "Forbidden. You do not have permission to perform this action.",
          403
        )
      );
    }

    next();
  };
};
