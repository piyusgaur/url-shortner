import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { shortenRouter } from "./routes/shorten.js";
import { redirectRouter } from "./routes/redirect.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(shortenRouter);
app.use(redirectRouter);

app.use(notFoundHandler);
app.use(errorHandler);
