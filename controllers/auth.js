const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { schemas } = require("../models/user");

const {SECRET_KEY} = process.env;

const { ctrlWrapper } = require("../helpers");

const register = async (req, res, next) => {
  const { password, email } = req.body;
 

  try {
    const user = await User.findOne({ email }).exec();
     
  const { error } = schemas.registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  

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
    next({ status: 400, message: error.details[0].message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const { error } = schemas.loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
    

    // if (!email || !password) 
    // return res.status(400).json({ message: "missing required fields" });

    const user = await User.findOne({ email }).exec();

    if (!user) return res.status(401).send({ message: "Email or password is wrong" });

    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin) return res.status(401).send({ message: "Email or password is wrong" });

    const payload = {
      id: user._id,
    };

   
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, {token});

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next({ status: 400, message: error.details[0].message });
  
  }
};

const getCurrent = async (req, res) =>{
  const {subscription ,email} = req.user;

  res.json({
    subscription,
    email
  })
}

const logOut = async(req, res) =>{
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ""});

  res.status(204).json({message: "No content"})
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logOut: ctrlWrapper(logOut)
};
