const express = require("express");
const { tryOn } = require("../controllers/aiController");

const router = express.Router();

router.post("/tryon", tryOn);

module.exports = router;