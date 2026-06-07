import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { AppError } from "../utils/AppError";
import { UserRole } from "@prisma/client";

export const checkRole = (allowedRoles:any) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    console.log(allowedRoles);
    console.log(req);
    if (!req.user) {
      return next(new AppError("Unauthorized. Please authenticate.", 401));
    }

  
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
