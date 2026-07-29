const express = require("express");
const router = express.Router();

const {
  getEstablecimientoById,
  listEstablecimientos,
} = require("../controllers/superadmin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

router.get(
  "/establecimientos",
  authMiddleware,
  requireRole("superadmin"),
  listEstablecimientos
);

router.get(
  "/establecimientos/:id",
  authMiddleware,
  requireRole("superadmin"),
  getEstablecimientoById
);

module.exports = router;
