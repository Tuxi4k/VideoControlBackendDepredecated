import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface FormData {
  fio?: string;
  phone?: string;
  address?: string;
  house?: string;
  agreement?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

async function sendEmail(formData: FormData): Promise<EmailResult> {
  const mailOptions = {
    from: `${formData.fio} <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: "Новая заявка с формы",
    html: `
      <h2>📋 Новая заявка</h2>
      <p><strong>👤 ФИО:</strong> ${formData.fio || "Не указано"}</p>
      <p><strong>📞 Телефон:</strong> ${formData.phone || "Не указано"}</p>
      <p><strong>📍 Адрес:</strong> ${formData.address || "Не указано"}</p>
      <p><strong>🏠 Дом:</strong> ${formData.house || "Не указано"}</p>
      <p><strong>✅ Соглашение:</strong> ${
        formData.agreement === "on" ? "Принято" : "Не принято"
      }</p>
      <hr>
      <p><small>📅 Отправлено: ${new Date().toLocaleString("ru-RU")}</small></p>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email отправлен! ID:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error("Ошибка отправки email:", error.message);
    return { success: false, error: error.message };
  }
}

export default sendEmail;
