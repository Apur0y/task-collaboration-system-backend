import express from "express";
import { UserController } from "./user.controller";

import { UserRole } from "@prisma/client";
import { checkRole } from "../../middleware/checkRole";

const router = express.Router();

router.get(
  "/",
//   checkRole(UserRole.ADMIN),
  UserController.getAllUsers
);

router.get(
  "/:id",
  checkRole(UserRole.USER),
  UserController.getUserById
);

router.patch(
  "/:id",
  checkRole(UserRole.USER),
  UserController.updateUser
);

router.delete(
  "/:id",
  checkRole(UserRole.ADMIN),
  UserController.deleteUser
);

export default router;