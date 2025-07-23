import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmail,
} from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserController = async (req, res) => {
  const { refreshToken } = req.cookies;
  const newSession = await refreshSession({ refreshToken });
  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await logoutUser(refreshToken);
  }
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  await sendResetEmail(req.body.email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
