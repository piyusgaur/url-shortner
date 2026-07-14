import "dotenv/config";
import { app } from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { getEnvNumber } from "./config/env.js";

const port = getEnvNumber(process.env.PORT, 4000);

async function start() {
  await connectMongo();

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

void start();
