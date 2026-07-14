import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI;

async function start() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(mongoUri);

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

void start();
