import { Router } from "express";
import * as dashboardController from "../dashboard/dashboard.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Aggregate metrics and analytics (scoped by user role)
 * @access  Authenticated
 */
router.get("/stats", authenticate, dashboardController.getStats);

export default router;
