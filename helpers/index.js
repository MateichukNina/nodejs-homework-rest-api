const ctrlWrapper = require('./ctrlWrapper');
const {contactValidator, authValidator} = require("./bodyValidate");
const authenticate = require("./autorization");

module.exports = {
  ctrlWrapper,
  authenticate,
  authValidator,
  contactValidator
}