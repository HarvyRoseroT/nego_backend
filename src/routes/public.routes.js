const express = require("express");
const router = express.Router();
const controller = require("../controllers/public.controller");

router.get("/nearby", controller.nearby);

module.exports = router;
    