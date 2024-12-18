import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import emailSender from "./services/emailSender.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB(process.env.DB_URI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router);
app.get("/sent-email", async (req, res) => {
  const emailSent = await emailSender({
    to: "pankajteceract@gmail.com",
    subject: "main app email testing",
    ejsPath: `${__dirname}/views/emails/passwordReset.ejs`,
    ejsDataObject: { name: "jipankaj" },
  });
  res.json({ message: "email sent", emailSent });
});

app.listen(PORT, () => console.log(`Port is running on ${PORT}`));
