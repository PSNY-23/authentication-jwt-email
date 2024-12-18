import emailSender from "./services/emailSender.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    // Use await to wait for the rendering process
    const html = await ejs.renderFile(
      path.join(__dirname, "views/EmailTemplate.ejs"),
      { name: "pankaj" }
    );

    // Use await to wait for the email to be sent
    const sentMail = await emailSender(
      "pankajteceract@gmail.com",
      "Authentication mail testing",
      html
    );

    // Check if the email was sent successfully
    if (sentMail) {
      res.json({ message: "Email sent", email: "html" });
    } else {
      res.json({ message: "Error sending email" });
    }
  } catch (err) {
    // Handle any errors during the rendering or email sending process
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
