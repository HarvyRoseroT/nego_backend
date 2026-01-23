const express = require("express");
const router = express.Router();
const controller = require("../controllers/analytics.stats.controller");

router.get(
  "/establecimiento/:id/resumen",
  controller.getResumen
);

router.get(
  "/establecimiento/:id/visitas",
  controller.getVisitasPorDia
);

router.get(
  "/establecimiento/:id/origen",
  controller.getOrigenVisitas
);

router.get(
  "/establecimiento/:id/cartas-top",
  controller.getCartasTop
);

module.exports = router;
