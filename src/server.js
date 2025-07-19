import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsRouter from './routers/contactsRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  })
);

app.use('/api/contacts', contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
