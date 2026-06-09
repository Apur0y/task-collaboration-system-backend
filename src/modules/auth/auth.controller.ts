import { Request, Response, NextFunction } from "express";

import * as authService from "../auth/auth.service";
import { LoginInput, SignupInput } from "../auth/auth.validator";
import { sendSuccess } from "../../utils/response";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.signup(req.body as SignupInput);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.login(req.body as LoginInput);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      user: result.user,
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    sendSuccess(res, {
      message: "Logout successful",
    });
  } catch (err) {
    next(err);
  }
};
