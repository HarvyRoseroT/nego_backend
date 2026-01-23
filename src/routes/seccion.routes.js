const express = require("express");
const router = express.Router();

const seccionController = require("../controllers/seccion.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkSubscription = require("../middlewares/checkSubscription");

router.post(
  "/",
  authMiddleware,
  checkSubscription,
  seccionController.createSeccion
);

router.get(
  "/carta/:cartaId",
  authMiddleware,
  checkSubscription,
  seccionController.getSeccionesByCarta
);

router.get(
  "/:id",
  authMiddleware,
  checkSubscription,
  seccionController.getSeccionById
);

router.put(
  "/:id",
  authMiddleware,
  checkSubscription,
  seccionController.updateSeccion
);

router.delete(
  "/:id",
  authMiddleware,
  checkSubscription,
  seccionController.deleteSeccion
);

router.put(
  "/reordenar/orden",
  authMiddleware,
  checkSubscription,
  seccionController.reordenarSecciones
);

module.exports = router;
