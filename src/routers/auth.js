import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  refreshUserController,
  logoutUserController,
  sendResetEmailController,
} from '../controllers/auth.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestRefreshTokenSchema,
  requestResetEmailSchema,
} from '../schemas/authSchemas.js';
import validateBody from '../middlewares/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController)
);

authRouter.post('/refresh', ctrlWrapper(refreshUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(sendResetEmailController)
);

export default authRouter;
