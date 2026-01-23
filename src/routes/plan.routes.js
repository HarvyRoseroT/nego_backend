const express = require("express");
const router = express.Router();
const controller = require("../controllers/plan.controller");

router.get("/", controller.getPlanes);

module.exports = router;
