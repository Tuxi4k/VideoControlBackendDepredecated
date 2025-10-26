// src/shared/telegramService.ts
import TelegramBot from "node-telegram-bot-api";
import { FormData } from "../types/requests";
import { logger } from "../utils/logger";
import config from "@/config/constants";

export interface TelegramResult {
  success: boolean;
  sentCount?: number;
  error?: string;
}

export class TelegramService {
  private bot: TelegramBot;
  private chatIds: string[];

  constructor() {
    this.bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN || "", {
      polling: false,
    });
    this.chatIds = config.TELEGRAM_CHAT_IDS;
  }

  async sendFormNotification(formData: FormData): Promise<TelegramResult> {
    const message = `
📋 *Новая заявка*

👤 *ФИО:* ${formData.fio}
📞 *Телефон:* ${formData.phone}
📍 *Адрес:* ${formData.address}
🏠 *Дом:* ${formData.house}
📧 *Email:* ${formData.email || "Не указан"}
✅ *Соглашение:* ${formData.agreement}

📅 *Время:* ${new Date().toLocaleString("ru-RU")}
    `;

    try {
      const sendPromises = this.chatIds.map((chatId) =>
        this.bot.sendMessage(chatId, message, { parse_mode: "Markdown" })
      );

      const results = await Promise.all(sendPromises);
      logger.info(
        `Сообщения отправлены в Telegram: ${results.length} получателей`
      );
      return { success: true, sentCount: results.length };
    } catch (error: any) {
      logger.error("Ошибка отправки в Telegram:", error.message);
      return { success: false, error: error.message };
    }
  }
}
