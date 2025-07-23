import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { sendEmail } from '../utils/sendEmail.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await User.create({
    ...payload,
    password: hashedPassword,
  });
  return newUser;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }
  const passwordMatch = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatch) {
    throw createHttpError(401, 'Unauthorized');
  }
  await Session.deleteOne({ userId: user._id });
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  const newSession = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
  return { ...newSession.toObject(), accessToken };
};

export const refreshSession = async ({ refreshToken }) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'User associated with this session not found');
  }

  await Session.deleteOne({ _id: session._id });

  const newAccessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const newRefreshToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  const newSession = await Session.create({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return {
    ...newSession.toObject(),
    accessToken: newAccessToken,
  };
};

export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;
  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Hello ${user.name},</p><p>To reset your password, please click on the link below:</p><a href="${resetLink}">Reset Password</a><p>This link will expire in 5 minutes.</p>`,
    });
  } catch (err) {
    console.error(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.'
    );
  }
};

export const resetPassword = async (payload) => {
  let decoded;
  try {
    decoded = jwt.verify(payload.token, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({
    email: decoded.email,
    _id: decoded.userId,
  });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const newHashedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: newHashedPassword });

  await Session.deleteMany({ userId: user._id });
};
