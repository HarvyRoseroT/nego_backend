const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const checkSubscription = require("../middlewares/checkSubscription");
const controller = require("../controllers/carta.controller");

router.post("/", auth, checkSubscription, controller.create);

router.get(
  "/establecimiento/:establecimientoId",
  auth,
  checkSubscription,
  controller.listByEstablecimiento
);

router.get(
  "/:id",
  auth,
  checkSubscription,
  controller.getById
);

router.put(
  "/orden",
  auth,
  checkSubscription,
  controller.updateOrden
);

router.patch(
  "/:id/deactivate",
  auth,
  checkSubscription,
  controller.deactivate
);

router.put(
  "/:id",
  auth,
  checkSubscription,
  controller.update
);

router.delete(
  "/:id",
  auth,
  checkSubscription,
  controller.delete
);

module.exports = router;
