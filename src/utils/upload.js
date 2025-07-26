import multer from 'multer';
import path from 'node:path';
import createHttpError from 'http-errors';
const destination = path.resolve('temp');

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePreffix}_${file.originalname}`);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split('.').pop();
  if (extension === 'exe' || extension === 'msi') {
    return cb(
      createHttpError(400, 'EXE or MSI file extensions are not allowed')
    );
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
