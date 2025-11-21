import express from "express";
import routes from "./routes.js";
import cors from "cors";
import dotenv from "dotenv";
// TODO: complete me (loading the necessary packages)

dotenv.config();


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = FRONTEND_URL
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const app = express();

// TODO: complete me (CORS)

app.use(
  cors({
     origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // If no explicit allow-list is provided, fall back to letting Vite
      // preview (4173) access the API as well.
      const previewOrigin = "http://localhost:4173";
      if (!process.env.FRONTEND_URL && origin === previewOrigin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use('', routes);

export default app;