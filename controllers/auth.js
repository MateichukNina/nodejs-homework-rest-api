const { User } = require("../models/user");

const { ctrlWrapper } = require("../helpers");

const register = async (res, req) => {
  const { password, email, subscription } = req.body;
  await User.create({ password, email, subscription });

  res.status(201).send({
    user: {
      email,
      subscription,
    },
  });
};

const login = async (res, req)=>{

}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login)
};
