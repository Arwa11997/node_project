const jwt = require("jsonwebtoken");
const User = require("./auth/userModel");
const util = require("util");
const asyncVerify = util.promisify(jwt.verify);

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token === "null") {
    return res.status(401).send("access rejected...");
  }
  try {
    const decode = await asyncVerify(token, process.env.SECRET_KEY);
    const user = await User.findById(decode.id);
    req.user = user;
  } catch (error) {
    error.message = "unauthorized request";
    error.statusCode = 401;
    next(error);
  }
  next();
};

module.exports = verifyToken;
