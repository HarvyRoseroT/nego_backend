const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const checkSubscription = require("../middlewares/checkSubscription");
const controller = require("../controllers/planoEstablecimiento.controller");

router.post("/", auth, checkSubscription, controller.create);

router.get(
  "/establecimiento/:establecimientoId",
  auth,
  checkSubscription,
  controller.getByEstablecimiento
);

router.get("/:id", auth, checkSubscription, controller.getById);
router.put("/:id", auth, checkSubscription, controller.update);
router.delete("/:id", auth, checkSubscription, controller.remove);

router.post(
  "/:planoId/elementos",
  auth,
  checkSubscription,
  controller.createElemento
);

router.put(
  "/:planoId/elementos/:elementoId",
  auth,
  checkSubscription,
  controller.updateElemento
);

router.delete(
  "/:planoId/elementos/:elementoId",
  auth,
  checkSubscription,
  controller.deleteElemento
);

module.exports = router;
