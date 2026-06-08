import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";


import projectRoutes from "./modules/project/project.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import activityRoutes from "./modules/activity/activity.routes";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";

import { errorHandler, notFound } from "./middleware/errorHandler";
import taskRoutes from "./modules/task/task.routes";

const app: Application = express();

// ─── Security & Utility Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cookieParser());

// Configure CORS based on environment
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// ─── Global Rate Limiting ─────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: "Too many auth attempts. Please try again later." },
});

app.use("/api", limiter);
app.use("/api/auth", authLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "development",
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

// ─── 404 & Error Handlers ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
