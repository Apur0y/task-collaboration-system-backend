import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/response";

interface PrismaKnownError extends Error {
  code: string;
  meta?: Record<string, unknown>;
}

const isPrismaKnownError = (err: unknown): err is PrismaKnownError =>
  err instanceof Error &&
  err.constructor.name === "PrismaClientKnownRequestError" &&
  "code" in err;

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Zod Validation Errors
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    return sendError(res, messages, 422);
  }

  // Custom Operational Errors
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Prisma unique constraint violation
  if (isPrismaKnownError(err)) {
    if (err.code === "P2002") {
      const fields = (err.meta?.target as string[])?.join(", ") ?? "field";
      return sendError(res, `Unique constraint violated on: ${fields}`, 409);
    }
    if (err.code === "P2025") {
      return sendError(res, "Record not found.", 404);
    }
    return sendError(res, `Database error: ${err.message}`, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, "Invalid token. Please log in again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    return sendError(res, "Token expired. Please log in again.", 401);
  }

  // Unknown errors
  console.error("UNHANDLED ERROR:", err);
  return sendError(res, "Internal server error.", 500);
};

export const notFound = (_req: Request, res: Response): Response => {
  return sendError(res, `Route not found.`, 404);
};
