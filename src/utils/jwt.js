const jwt = require("jsonwebtoken");

exports.generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = "30d") => {
  return jwt.sign(payload, secret, { expiresIn });
};