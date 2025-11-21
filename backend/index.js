import express from "express";
import routes from "./routes.js";
import cors from "cors";
import dotenv from "dotenv";
// TODO: complete me (loading the necessary packages)

dotenv.config();

const app = express();

// TODO: complete me (CORS)

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use('', routes);

export default app;