/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import sgMail, { MailDataRequired } from "@sendgrid/mail";
import "dotenv/config";
import { BaseEmailSettings } from "./interfaces";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const createBaseEmail = (): BaseEmailSettings => ({
  from: `CruiseWare <${process.env.SENDGRID_EMAIL}>`,
  mail_settings: { sandbox_mode: { enable: false } },
});

const enableSandboxMode = (email: BaseEmailSettings) => {
  email.mail_settings.sandbox_mode.enable = true;
};

const sendEmail = async (email: string, subject: string, message: string) => {
  const msg: MailDataRequired = {
    ...createBaseEmail(),
    to: email,
    subject,
    text: message,
  };

  try {
    await sgMail.send(msg);
    console.log("Message sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

export default sendEmail;
