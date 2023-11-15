const { User } = require("../models/user");
const bcrypt = require("bcrypt")

const { ctrlWrapper } = require("../helpers");

const register = async (req, res, next) => {
  const { password, email, subscription, name } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user !== null) res.status(409).send({ message: 'Email in use' });

    const passwordHash = bcrypt.hashSync(password, 10);

    await User.create({ password: passwordHash, email, subscription });

    res.status(201).send({
      user: {name,
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};



const login = async (res, req)=>{
// const {email, password} = req.body;

// const user = await User.findOne({ email }).exec();


}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login)
};
