import { Router } from "express";
import { validate } from "../../middleware/validate";
import { loginSchema, signupSchema } from "../auth/auth.validator";
import * as authController from "../auth/auth.controller";


const router = Router();


router.post("/signup", validate(signupSchema), authController.signup);


router.post("/login", validate(loginSchema), authController.login);

export default router;
