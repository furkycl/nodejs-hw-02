import { Router } from 'express';
import { registerUserController } from '../controllers/auth.js';
import { registerUserSchema } from '../schemas/authSchemas.js';
import validateBody from '../middlewares/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

export default authRouter;
