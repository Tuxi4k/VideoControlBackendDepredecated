// src/client/form/formService.ts
import { EmailService } from "@shared/emailService";
import { TelegramService } from "@shared/telegramService";
import { UserRepository } from "@admin/database/userRepository";
import type { FormData, CreateContactData } from "@/types/requests";
import { Prisma } from "@prisma/client";

export class FormService {
  private emailService: EmailService;
  private telegramService: TelegramService;
  private userRepository: UserRepository;

  constructor() {
    this.emailService = new EmailService();
    this.telegramService = new TelegramService();
    this.userRepository = new UserRepository();
  }

  async processFormSubmission(formData: FormData) {
    const [telegramResult, emailResult] = await Promise.all([
      this.telegramService.sendFormNotification(formData),
      this.emailService.sendFormNotification(formData),
    ]);

    // Преобразуем FormData в CreateContactData
    const contactData: CreateContactData = {
      fio: formData.fio,
      phone: formData.phone,
      address: formData.address,
      house: formData.house,
      agreement: formData.agreement,
      email: formData.email,
      tags: {
        source: "website_form",
        timestamp: new Date().toISOString(),
        ip: "unknown", // Можно добавить позже из req.ip
      } as Prisma.JsonValue,
    };

    const userSaved = await this.userRepository.addContact(contactData);

    return {
      telegramSuccess: telegramResult.success,
      emailSuccess: emailResult.success,
      userSaved,
    };
  }
}
