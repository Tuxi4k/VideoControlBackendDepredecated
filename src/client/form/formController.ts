import { Request, Response, NextFunction } from "express";
import { FormService } from "./formService";
import config from "@/config/constants";

export class FormController {
  private formService: FormService;

  constructor() {
    this.formService = new FormService();
  }

  submitForm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.formService.processFormSubmission(req.body);

      // logger.info("Форма успешно обработана", {
      //   telegramSent: result.telegramSuccess,
      //   emailSent: result.emailSuccess,
      //   userSaved: result.userSaved,
      // });

      res.redirect(config.SITE_ADDRESS);
    } catch (error) {
      // logger.error("Ошибка обработки формы:", error);
      next(error);
    }
  };
}
