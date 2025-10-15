import "dotenv/config";
import express from "express";
import bot from "@utils/telegramBot";
import clRouter from "./client/formController";
import userContrRouter from "./admin/usersController";
import cors from "cors";

const TelegramIds = process.env.TELEGRAM_CHAT_IDS.split(",");
const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://192.168.1.66"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/client", clRouter);
app.use("/admin/api/users-base", userContrRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\nСервер запущен на http://127.0.0.1:${PORT}`);
  console.log(`Email сервис: ${process.env.EMAIL_USER ? "запущен" : "ошибка"}`);
  console.log(`Telegram бот: ${bot.isPolling ? "запущен" : "ошибка"}`);
  console.log(`Получателей в Telegram: ${TelegramIds.length}`);
});
