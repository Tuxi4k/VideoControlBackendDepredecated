import bot from "@utils/telegramBot";

interface FormData {
  fio?: string;
  phone?: string;
  address?: string;
  house?: string;
  agreement?: string;
}

interface TelegramResult {
  success: boolean;
  sentCount?: number;
  error?: string;
}

const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS
  ? process.env.TELEGRAM_CHAT_IDS.split(",")
  : ["YOUR_CHAT_ID"];

async function sendToTelegram(formData: FormData): Promise<TelegramResult> {
  const message = `
📋 *Новая заявка*

👤 *ФИО:* ${formData.fio || "Не указано"}
📞 *Телефон:* ${formData.phone || "Не указано"}
📍 *Адрес:* ${formData.address || "Не указано"}
🏠 *Дом:* ${formData.house || "Не указано"}
✅ *Соглашение:* ${formData.agreement === "on" ? "Принято" : "Не принято"}

📅 *Время:* ${new Date().toLocaleString("ru-RU")}
  `;

  try {
    const sendPromises = TELEGRAM_CHAT_IDS.map((chatId) =>
      bot.sendMessage(chatId, message, { parse_mode: "Markdown" })
    );

    const results = await Promise.all(sendPromises);
    console.log(
      `Сообщения отправлены в Telegram: ${results.length} получателей`
    );
    return { success: true, sentCount: results.length };
  } catch (error: any) {
    console.error("Ошибка отправки в Telegram:", error.message);
    return { success: false, error: error.message };
  }
}

export default sendToTelegram;
