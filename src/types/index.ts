import { UserRole } from "./enums";
import { Request } from "express";

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total?: number;
  page?: number;
  limit?: number;
  nextCursor?: string | null;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  cursor?: string;
}
