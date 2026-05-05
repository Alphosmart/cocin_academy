function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const isValidationError = err.name === "ValidationError";
  const isZodError = err.name === "ZodError";
  const statusCode = err.statusCode || (isValidationError || isZodError ? 400 : 500);
  const validationMessages = isValidationError ? Object.values(err.errors || {}).map((error) => error.message) : undefined;
  const zodMessages = isZodError ? err.errors?.map((error) => error.message) : undefined;
  res.status(statusCode).json({
    message: validationMessages?.join(", ") || zodMessages?.join(", ") || err.message || "Server error",
    errors: process.env.NODE_ENV === "production" ? undefined : err.errors,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}

module.exports = { notFound, errorHandler };
