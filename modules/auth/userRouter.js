const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./userModel");
const auth = require("../middlewares");
const jwt = require("jsonwebtoken");
const util = require("util");
const userRouter = express.Router();
const asyncSign = util.promisify(jwt.sign);
const secretKey = "ksdwkjwncnjewfjwnewrnj";
userRouter.post("/register", async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      throw new Error("email found in the database");
    }
    user = new User({ name, password, email });
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
    const createdUser = await user.save();
    const token = await asyncSign({ _id: user._id }, secretKey);
    res.send({ token });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
});
userRouter.post("/login", async (req, res, next) => {
  const { password, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      throw new Error("invalid email or password");
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      throw new Error("invalid email or password'");
    }
    const token = await asyncSign({ _id: user._id }, secretKey);
    res.send({ token });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

module.exports = userRouter;
