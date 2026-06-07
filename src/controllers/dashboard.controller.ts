import { Response, NextFunction } from "express";
import * as dashboardRepo from "../repositories/dashboard.repository";
import { sendSuccess } from "../utils/response";
import { AuthRequest } from "../types";

export const getStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await dashboardRepo.getDashboardStats(
      req.user!.userId,
      req.user!.role
    );
    sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
};
