const jwt = require("jsonwebtoken");

exports.generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = "30d") => {
  return jwt.sign(payload, secret, { expiresIn });
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "20d" });
};

exports.verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret);
};