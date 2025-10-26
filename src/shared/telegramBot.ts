// src/shared/telegramBot.ts
import config from "@/config/constants";
import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = config.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN || "", { polling: false });

export default bot;
