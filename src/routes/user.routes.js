const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const checkSubscription = require("../middlewares/checkSubscription");

router.get("/me", authMiddleware, checkSubscription, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
