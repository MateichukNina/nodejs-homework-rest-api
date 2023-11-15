

 const contactValidator = schema => data => {
  return schema.validate(data, { abortEarly: false });
};

 const authValidator = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) next((400, error.message));

  return next();
};

module.exports = {contactValidator, authValidator}