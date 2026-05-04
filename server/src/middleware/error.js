function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Server error",
    errors: err.errors,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}

module.exports = { notFound, errorHandler };
