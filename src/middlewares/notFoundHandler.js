import { NotFound } from 'http-errors';

export default function notFoundHandler(req, res, next) {
  next(new NotFound('Route not found'));
}
