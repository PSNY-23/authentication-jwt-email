import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB(process.env.DB_URI);

app.use("/api", router);

app.listen(PORT, () => console.log(`Port is running on ${PORT}`));
