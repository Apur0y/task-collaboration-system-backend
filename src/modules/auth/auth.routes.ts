import { Router } from "express";
import { validate } from "../../middleware/validate";
import { loginSchema, signupSchema } from "../auth/auth.validator";
import * as authController from "../auth/auth.controller";


const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", validate(signupSchema), authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post("/login", validate(loginSchema), authController.login);

export default router;
