import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../types";
import { AppError } from "../utils/AppError";

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new AppError("No token provided. Please log in.", 401));
    }

    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(new AppError("Invalid or expired token", 401));
  }
};