import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';

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
