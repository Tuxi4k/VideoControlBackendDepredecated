import { Router } from "express";
import sendEmail from "@/utils/senders/emailSender";
import sendToTelegram from "@/utils/senders/telegramSender";
import { addContact } from "@/utils/database/requests";

const clRouter = Router();

const SITE_ADDRESS = process.env.SITE_ADDRESS;

clRouter.post("/sendForm", async (req, res) => {
  try {
    const [telegramResult, emailResult] = await Promise.all([
      sendToTelegram(req.body),
      sendEmail(req.body),
    ]);

    await addContact(req.body);

    await console.log(`Результаты отправки:`);
    console.log(
      `   Telegram: ${telegramResult.success ? "успех" : "ошибка"} ${
        telegramResult.sentCount || 0
      } получателей`
    );
    console.log(`   Email: ${emailResult.success ? "успех" : "ошибка"}`);

    res.redirect(SITE_ADDRESS);
  } catch (error) {
    console.error("Ошибка обработки формы:", error.message);
    res.redirect(SITE_ADDRESS);
  }
});

export default clRouter;
