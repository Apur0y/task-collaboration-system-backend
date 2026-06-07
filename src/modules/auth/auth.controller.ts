import { Request, Response, NextFunction } from "express";

import * as authService from "../auth/auth.service";
import { LoginInput, SignupInput } from "../../validators/auth.validator";
import { sendSuccess } from "../../utils/response";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
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
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(req.body as LoginInput);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};
