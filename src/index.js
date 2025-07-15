import dotenv from "dotenv";
dotenv.config();

import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

async function start() {
  try {
    console.log("Starting Mongo connection...");
    await initMongoConnection();
    console.log("Mongo connected, starting server...");
    setupServer();
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }
}

start();
