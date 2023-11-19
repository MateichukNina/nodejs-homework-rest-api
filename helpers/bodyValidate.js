

 const contactValidator = schema => data => {
  return schema.validate(data, { abortEarly: false });
};

 const authValidator = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return next({ status: 400, message: error.details[0].message });
  }

  return next();
};

module.exports = {contactValidator, authValidator}