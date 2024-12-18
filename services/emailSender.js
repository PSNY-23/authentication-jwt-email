import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

// Send the email
function emailSender(to, sub, html) {
  transporter.sendMail(
    {
      from: "growmorequote@gmail.com",
      to: to,
      subject: sub,
      html: html,
    },
    (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
}

export default emailSender;
