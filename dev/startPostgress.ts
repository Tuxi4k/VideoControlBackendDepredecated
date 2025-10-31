import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "fs";

(async () => {
  try {
    const dbDir = "./.postgres";

    // Проверяем, была ли БД уже инициализирована
    const isInitialized = existsSync(dbDir);

    const pg = new EmbeddedPostgres({
      databaseDir: dbDir,
      user: "postgres",
      password: "password",
      port: 5432,
      persistent: true,
      initdbFlags: ["--locale=en_US.UTF-8", "--encoding=UTF8"],
      onLog: () => {},
      onError: (err) => console.error("❌ PostgreSQL Error:", err),
    });

    // Инициализируем только если БД еще не существует
    if (!isInitialized) {
      await pg.initialise();
    }

    console.log("🚀 Starting PostgreSQL...");
    await pg.start();

    // Создаем базу данных только если она не существует
    if (!isInitialized) {
      await pg.createDatabase("videoControlDev");
    }

    console.log("✅ Embedded PostgreSQL ready!");
    console.log(
      "🔗 URL: postgresql://postgres:password@localhost:5432/videoControlDev"
    );

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n🛑 Shutting down PostgreSQL...");
      await pg.stop();
      process.exit(0);
    });

    // Держим процесс alive
    await new Promise(() => {});
  } catch (error) {
    console.error("❌ Failed to start PostgreSQL:", error);

    // Если ошибка связана с уже существующей БД, пробуем просто запустить
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log(
        "🔄 Database already exists, trying to start without initialization..."
      );
      // Здесь можно добавить логику для перезапуска без инициализации
    }

    process.exit(1);
  }
})();
