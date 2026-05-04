module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });
  if (!result.success) {
    return res.status(422).json({
      message: "Validation failed",
      errors: result.error.flatten()
    });
  }
  req.validated = result.data;
  next();
};
