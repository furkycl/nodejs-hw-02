import cloudinary from '../config/cloudinary.js';
import fs from 'node:fs/promises';
export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.url;
};
