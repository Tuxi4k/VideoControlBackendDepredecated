import { EmailService } from "@shared/emailService";
import { TelegramService } from "@shared/telegramService";
import { Requests } from "@/admin/database/requests";
import type { FormData, CreateContactData } from "@/types/requests";

export class FormService {
  private emailService: EmailService;
  private telegramService: TelegramService;
  private Requests: Requests;

  constructor() {
    this.emailService = new EmailService();
    this.telegramService = new TelegramService();
    this.Requests = new Requests();
  }

  async processFormSubmission(formData: FormData) {
    const [telegramResult, emailResult] = await Promise.all([
      this.telegramService.sendFormNotification(formData),
      this.emailService.sendFormNotification(formData),
    ]);

    const contactData: CreateContactData = {
      fio: formData.fio,
      phone: formData.phone,
      address: formData.address,
      house: formData.house,
      agreement: formData.agreement,
      email: formData.email,
      tags: [
        {
          label: "Заявка",
        },
      ],
    };

    const userSaved = await this.Requests.addContact(contactData);

    return {
      telegramSuccess: telegramResult.success,
      emailSuccess: emailResult.success,
      userSaved,
    };
  }
}
