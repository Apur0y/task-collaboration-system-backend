import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { authenticate } from "../../middleware/authenticate";
import { verifyToken } from "../../utils/jwt";

export const UserController = {
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  },

  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

getMe: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyToken(token); // usually synchronous

    const user = await UserService.getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
},

  

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserService.deleteUser(req.params.id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },



};