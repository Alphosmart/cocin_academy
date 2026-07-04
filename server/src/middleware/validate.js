function pathLabel(path) {
  return path.filter((part) => part !== "body").join(".") || "form";
}

function fieldErrorsFromIssues(issues) {
  return issues.reduce((acc, issue) => {
    const key = pathLabel(issue.path);
    const current = acc[key]?.message;
    acc[key] = { message: current ? `${current}, ${issue.message}` : issue.message };
    return acc;
  }, {});
}

function stripUndefined(value) {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, stripUndefined(entryValue)])
  );
}

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });
  if (!result.success) {
    const errors = fieldErrorsFromIssues(result.error.issues);
    const message = Object.values(errors).map((error) => error.message).join(", ") || "Validation failed";
    return res.status(422).json({
      message,
      errors
    });
  }
  req.body = stripUndefined(result.data.body || {});
  req.validated = result.data;
  next();
};
