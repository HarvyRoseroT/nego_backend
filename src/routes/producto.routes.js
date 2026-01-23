const express = require("express");
const router = express.Router();

const productoController = require("../controllers/producto.controller");
const productoImagenController = require("../controllers/productoImagen.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkSubscription = require("../middlewares/checkSubscription");
const upload = require("../middlewares/upload");

router.post(
  "/",
  authMiddleware,
  checkSubscription,
  productoController.createProducto
);

router.get(
  "/seccion/:seccionId",
  authMiddleware,
  checkSubscription,
  productoController.getProductosBySeccion
);

router.get(
  "/:id",
  authMiddleware,
  checkSubscription,
  productoController.getProductoById
);

router.get(
  "/establecimiento/:establecimientoId",
  authMiddleware,
  checkSubscription,
  productoController.getProductosByEstablecimiento
);

router.put(
  "/:id",
  authMiddleware,
  checkSubscription,
  productoController.updateProducto
);

router.delete(
  "/:id",
  authMiddleware,
  checkSubscription,
  productoController.deleteProducto
);

router.put(
  "/reordenar/orden",
  authMiddleware,
  checkSubscription,
  productoController.reordenarProductos
);

router.put(
  "/:id/imagen",
  authMiddleware,
  checkSubscription,
  upload.single("image"),
  productoImagenController.subirImagenProducto
);

router.delete(
  "/:id/imagen",
  authMiddleware,
  checkSubscription,
  productoImagenController.borrarImagenProducto
);
module.exports = router;
