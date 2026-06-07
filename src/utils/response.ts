import { Response } from "express";
import { ApiResponse, PaginationMeta } from "../types";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta
): Response => {
  const payload: ApiResponse<T> = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode = 500
): Response => {
  const payload: ApiResponse = { success: false, error };
  return res.status(statusCode).json(payload);
};
