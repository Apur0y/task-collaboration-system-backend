import { Request, Response, NextFunction } from "express";
import * as activityRepo from "../activity/activity.repository";
import { sendSuccess } from "../../utils/response";


export const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 10);
    const activities = await activityRepo.getRecentActivities(limit);
    sendSuccess(res, activities);
  } catch (err) {
    next(err);
  }
};
