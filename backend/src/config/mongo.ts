import mongoose from "mongoose";
import { getRequiredEnv } from "./env.js";

export async function connectMongo(): Promise<void> {
  const mongoUri = getRequiredEnv(process.env.MONGODB_URI, "MONGODB_URI");

  await mongoose.connect(mongoUri);
}
