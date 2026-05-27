function removeUndefined(input) {
  if (Array.isArray(input)) return input.map(removeUndefined);
  if (!input || typeof input !== "object" || input instanceof Date) return input;
  return Object.fromEntries(
    Object.entries(input)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, removeUndefined(value)])
  );
}

function formatValidationErrors(error) {
  return error.issues.reduce((errors, issue) => {
    const key = issue.path.join(".") || "form";
    errors[key] = { message: issue.message };
    return errors;
  }, {});
}

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });
  if (!result.success) {
    return res.status(422).json({
      message: "Validation failed",
      errors: formatValidationErrors(result.error)
    });
  }
  req.validated = removeUndefined(result.data);
  if (req.validated.body) req.body = req.validated.body;
  next();
};
