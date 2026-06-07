import { Router } from "express";
import * as activityController from "../activity/activity.controller";
import { authenticate } from "../../middleware/authenticate";
import { checkRole } from "../../middleware/checkRole";
import { UserRole } from "../../types/enums";

const router = Router();

/**
 * @route   GET /api/activities
 * @desc    Fetch the latest system activity entries (max 10)
 * @access  ADMIN, PROJECT_MANAGER
 */
router.get(
  "/",
  authenticate,
  checkRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  activityController.getActivities
);

export default router;
