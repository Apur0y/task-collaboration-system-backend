import express from "express";
import { UserController } from "./user.controller";

import { ProjectRole, UserRole } from "@prisma/client";
import { checkRole } from "../../middleware/checkRole";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

router.get(
  "/",
  authenticate,
  checkRole(UserRole.ADMIN),
  UserController.getAllUsers
);

router.get(
  "/:id",
  authenticate,
  checkRole(UserRole.USER),
  UserController.getUserById
);

router.patch(
  "/:id",
  authenticate,
  checkRole([UserRole.ADMIN]),
  UserController.updateUser
);

router.delete(
  "/:id",
   authenticate,
  checkRole(UserRole.ADMIN),
  UserController.deleteUser
);


router.get(
  "/me",
  UserController.getMe
);

export default router;