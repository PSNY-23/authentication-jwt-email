import nodemailer from "nodemailer";
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();

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

async function emailSender({ to, subject, ejsPath, ejsDataObject }) {
  const renderedHTML = await ejs.renderFile(ejsPath, ejsDataObject);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: to,
    subject: subject,
    html: renderedHTML,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { message: "Email sent", response: info.response };
  } catch (error) {
    console.error("Error sending email:", error);
    return { message: "Error sending email", error };
  }
}

export default emailSender;
