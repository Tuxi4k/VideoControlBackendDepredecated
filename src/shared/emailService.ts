// src/shared/emailService.ts
import nodemailer from "nodemailer";
import config from "@/config/constants";
import { FormData } from "../types/requests";
import { logger } from "../utils/logger";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });
  }

  async sendFormNotification(formData: FormData): Promise<EmailResult> {
    const mailOptions = {
      from: `${formData.fio} <${config.EMAIL_USER}>`,
      to: config.EMAIL_TO,
      subject: "Новая заявка с формы",
      html: `
        <h2>📋 Новая заявка</h2>
        <p><strong>👤 ФИО:</strong> ${formData.fio}</p>
        <p><strong>📞 Телефон:</strong> ${formData.phone}</p>
        <p><strong>📍 Адрес:</strong> ${formData.address}</p>
        <p><strong>🏠 Дом:</strong> ${formData.house}</p>
        <p><strong>📧 Email:</strong> ${formData.email || "Не указан"}</p>
        <p><strong>✅ Соглашение:</strong> ${formData.agreement}</p>
        <hr>
        <p><small>📅 Отправлено: ${new Date().toLocaleString(
          "ru-RU"
        )}</small></p>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      logger.info("Email отправлен! ID:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error: any) {
      logger.error("Ошибка отправки email:", error.message);
      return { success: false, error: error.message };
    }
  }
}
