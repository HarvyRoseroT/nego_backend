const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const checkSubscription = require("../middlewares/checkSubscription");
const upload = require("../middlewares/upload");

const controller = require("../controllers/establecimiento.controller");
const imagenController = require("../controllers/establecimientoImagen.controller");

router.post("/", authMiddleware, checkSubscription, controller.create);
router.get("/", authMiddleware, checkSubscription, controller.getMine);
router.get("/:id", authMiddleware, checkSubscription, controller.getById);
router.put("/:id", authMiddleware, checkSubscription, controller.update);
router.delete("/:id", authMiddleware, checkSubscription, controller.remove);

router.put(
  "/:id/logo",
  authMiddleware,
  checkSubscription,
  upload.single("image"),
  imagenController.subirLogo
);

router.delete(
  "/:id/logo",
  authMiddleware,
  checkSubscription,
  imagenController.borrarLogo
);

router.put(
  "/:id/imagen-ubicacion",
  authMiddleware,
  checkSubscription,
  upload.single("image"),
  imagenController.subirImagenUbicacion
);

router.delete(
  "/:id/imagen-ubicacion",
  authMiddleware,
  checkSubscription,
  imagenController.borrarImagenUbicacion
);

module.exports = router;
