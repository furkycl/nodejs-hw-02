import express from "express";
import cors from "cors";
import pino from "pino-http";
import {
  handleGetContacts,
  handleGetContactById,
} from "./controllers/contactsController.js";

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());

  app.get("/contacts", handleGetContacts);
  app.get("/contacts/:contactId", handleGetContactById);

  app.use("*", (req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
