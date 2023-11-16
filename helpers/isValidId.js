const { isValidObjectId } = require("mongoose");
// const { HttpError } = require("../helpers/HttpError.js");

const isValidId = (req, _, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    next((400, `${id} is not valid id`));
  }

  next();
};

 module.exports = isValidId;