const nodemailer = require("nodemailer");
require("dotenv").config();

async function test() {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
      to: process.env.MAIL_USER,
      subject: "Test Email",
      text: "This is a test email from the system.",
    });
    console.log("Email sent successfully: " + info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }
}

test();
