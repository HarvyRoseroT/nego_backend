const express = require("express");
const { tryOn } = require("../controllers/aiController");
const {
  getTryOnStatus,
  updateTryOnStatus
} = require("../controllers/aiAdmin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

const router = express.Router();

router.post("/tryon", tryOn);
router.get("/status", authMiddleware, requireRole("superadmin"), getTryOnStatus);
router.patch("/status", authMiddleware, requireRole("superadmin"), updateTryOnStatus);

module.exports = router;
