export default function errorHandler(err, req, res, next) {
  console.error('❌', err.message);

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Something went wrong',
    data: err.name,
  });
}
