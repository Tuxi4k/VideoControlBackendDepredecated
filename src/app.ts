import express from "express";
import cors from "cors";
import config from "./config/constants";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

export const app = express();

app.use(
  cors({
    origin: config.CORS_ORIGINS,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

app.use("/api", routes);

app.use(errorHandler);

export default app;
