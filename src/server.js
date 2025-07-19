import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from './routers/contactsRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(pino());

// Routes
app.use('/api/contacts', contactsRouter);

// Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

initMongoConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
