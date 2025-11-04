import { app } from "./app";
import config from "./config/constants";
import { logger } from "./utils/logger";
import bot from "./shared/telegramBot";

const startServer = async (): Promise<void> => {
  try {
    const port =
      typeof config.PORT === "string" ? parseInt(config.PORT) : config.PORT;

    const server = app.listen(port, "0.0.0.0", () => {
      logger.info(`🚀 Server running on http://127.0.0.1:${port}`);
      logger.info(
        `📧 Email сервис: ${config.EMAIL_USER ? "запущен" : "ошибка"}`
      );
      logger.info(`🤖 Telegram бот: ${bot ? "запущен" : "ошибка"}`);
      logger.info(
        `👥 Получателей в Telegram: ${config.TELEGRAM_CHAT_IDS.length}`
      );
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`📦 Received ${signal}, shutting down gracefully`);
      server.close(() => {
        logger.info("✅ HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
