const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const passwordController = require("../controllers/password.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", authController.register);
router.get("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.put("/update-notification-preferences", authMiddleware, authController.updateNotificationPreferences);
router.post("/logout", authController.logout);

router.post(
  "/request-password-reset",
  passwordController.requestPasswordReset
);

router.post(
  "/reset-password",
  passwordController.resetPassword
);

module.exports = router;
