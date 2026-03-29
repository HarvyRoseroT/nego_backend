const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  initUsuarioApp,
  subirImagenUsuarioApp,
  getEstablecimientosCercanos,
  getDetalleEstablecimiento,
  getDetalleEstablecimientoBySlug,
  getCartaDetalle,
  redirectBySlug
} = require("../controllers/usuarioApp.controller");

router.post("/usuarios/init", initUsuarioApp);
router.post("/usuarios/:id/imagen", upload.single("image"), subirImagenUsuarioApp);

router.get("/establecimientos/cercanos", getEstablecimientosCercanos);
router.get(
  "/establecimientos/:id/detalle",
  getDetalleEstablecimiento
);
router.get("/establecimientos/slug/:slug", getDetalleEstablecimientoBySlug);


router.get("/cartas/:id", getCartaDetalle);
router.get("/e/:slug", redirectBySlug);

module.exports = router;
