import EmbeddedPostgres from "embedded-postgres";
import { existsSync, rmSync } from "fs";

(async () => {
  try {
    // Удаляем старую БД если есть
    if (existsSync("./.postgres")) {
      console.log("🗑️ Removing old database...");
      rmSync("./.postgres", { recursive: true, force: true });
    }

    const pg = new EmbeddedPostgres({
      databaseDir: "./.postgres",
      user: "postgres",
      password: "password",
      port: 5432,
      persistent: true,
      // Указываем локаль явно
      initdbFlags: ["--locale=en_US.UTF-8", "--encoding=UTF8"],
      onLog: (msg) => console.log("📝 PostgreSQL:", msg),
      onError: (err) => console.error("❌ PostgreSQL Error:", err),
    });

    console.log("🔧 Initializing PostgreSQL...");
    await pg.initialise();

    console.log("🚀 Starting PostgreSQL...");
    await pg.start();

    console.log("📊 Creating database...");
    await pg.createDatabase("videoControlDev");

    console.log("✅ Embedded PostgreSQL ready!");
    console.log(
      "🔗 URL: postgresql://postgres:password@localhost:5432/videoControlDev"
    );

    // Держим процесс alive
    await new Promise(() => {});
  } catch (error) {
    console.error("❌ Failed to start PostgreSQL:", error);
    process.exit(1);
  }
})();
