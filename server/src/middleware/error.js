function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const isValidationError = err.name === "ValidationError";
  const isZodError = err.name === "ZodError";
  const isMulterError = err.name === "MulterError";
  const multerMessages = {
    LIMIT_FILE_SIZE: "Uploaded file is too large.",
    LIMIT_FILE_COUNT: "Too many files were uploaded.",
    LIMIT_UNEXPECTED_FILE: "Unexpected upload field."
  };
  const statusCode = err.statusCode || (err.code === "LIMIT_FILE_SIZE" ? 413 : (isValidationError || isZodError || isMulterError ? 400 : 500));
  const validationMessages = isValidationError ? Object.values(err.errors || {}).map((error) => error.message) : undefined;
  const zodMessages = isZodError ? err.errors?.map((error) => error.message) : undefined;
  res.status(statusCode).json({
    message: validationMessages?.join(", ") || zodMessages?.join(", ") || err.publicMessage || multerMessages[err.code] || err.message || "Server error",
    errors: process.env.NODE_ENV === "production" ? undefined : err.errors,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}

module.exports = { notFound, errorHandler };
