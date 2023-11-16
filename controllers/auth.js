const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const {SECRET_KEY} = process.env;

const { ctrlWrapper } = require("../helpers");

const register = async (req, res, next) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user) res.status(409).send({ message: "Email in use" });

    const createHashPassword = await bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: createHashPassword,
    });

    res.status(201).send({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body; 

    const user = await User.findOne({ email }).exec();

    if (!user) return res.status(401).send({ message: "Email or password is wrong" });

    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin) return res.status(401).send({ message: "Email or password is wrong" });

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    console.error(error); 
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
