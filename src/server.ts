import "dotenv/config";
import app from "./app";
import prisma from "./config/database";

const PORT = parseInt(process.env.PORT ?? "3000", 10);

const bootstrap = async (): Promise<void> => {
  try {
    // Verify database connectivity on startup
    await prisma.$connect();
    console.log("✅ Database connected successfully.");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV ?? "development"}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log("🔌 Database disconnected.");
        console.log("👋 Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason: Error) => {
      console.error("❌ Unhandled Rejection:", reason.message);
      shutdown("UNHANDLED_REJECTION");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

bootstrap();
