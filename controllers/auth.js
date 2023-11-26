const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { registerSchema, loginSchema } = require("../models/user");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const { SECRET_KEY } = process.env;

const { ctrlWrapper } = require("../helpers");

const register = async (req, res, next) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    const { error } = registerSchema.validate(req.body);

    if (error) {
      console.log("Validation Error:", error);
      return res.status(400).json({ message: error.details[0].message });
    }

    if (user) res.status(409).send({ message: "Email in use" });

    const avatarURL = gravatar.url(email);

    const createHashPassword = await bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: createHashPassword,
      avatarURL,
    });

    await Jimp.read(avatarURL).then((image) => {
      return image.resize(250, 250).quality(90).write(avatarURL);
    });

    res.status(201).send({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.log("Unexpected Error:", error);
    next({ status: 400, message: error.details[0].message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email }).exec();

    if (!user)
      return res.status(401).send({ message: "Email or password is wrong" });

    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin)
      return res.status(401).send({ message: "Email or password is wrong" });

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next({ status: 400, message: error.details[0].message });
  }
};

const getCurrent = async (req, res) => {
  const { subscription, email } = req.user;

  res.json({
    subscription,
    email,
  });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "No content" });
};

const uploadAvatar = async (req, res, next) => {
  try {

    if (!req.file) {
      return res.status(400).send({ message: 'No file attached' });
    }

    await fs.rename(
      req.file.path,
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    const imagePath = req.file.path;

    const image = await Jimp.read(imagePath);
    await image.resize(250, 250).quality(90).writeAsync(imagePath);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename, avatarURL: `${req.file.filename}` },
      { new: true }
    ).exec();
    console.log(updatedUser);

    if (updatedUser === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logOut: ctrlWrapper(logOut),
  uploadAvatar: ctrlWrapper(uploadAvatar),
 
};
