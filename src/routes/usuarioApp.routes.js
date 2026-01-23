const express = require("express");
const router = express.Router();

const {
  initUsuarioApp,
  getEstablecimientosCercanos,
  getDetalleEstablecimiento,
  getDetalleEstablecimientoBySlug,
  getCartaDetalle,
  redirectBySlug
} = require("../controllers/usuarioApp.controller");

router.post("/usuarios/init", initUsuarioApp);

router.get("/establecimientos/cercanos", getEstablecimientosCercanos);
router.get(
  "/establecimientos/:id/detalle",
  getDetalleEstablecimiento
);
router.get("/establecimientos/slug/:slug", getDetalleEstablecimientoBySlug);


router.get("/cartas/:id", getCartaDetalle);
router.get("/e/:slug", redirectBySlug);

module.exports = router;
