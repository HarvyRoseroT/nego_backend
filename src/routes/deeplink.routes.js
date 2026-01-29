const express = require("express");
const router = express.Router();
const { Establecimiento } = require("../models");

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.hasaroo.nego";

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const userAgent = req.headers["user-agent"] || "";

  if (
    !slug ||
    slug.includes(".") ||
    slug === "favicon.ico" ||
    slug === "robots.txt"
  ) {
    return res.status(404).end();
  }

  try {
    const establecimiento = await Establecimiento.findOne({
      where: { slug, activo: true },
    });

    if (!establecimiento) {
      return res.status(404).send("Not found");
    }

    // 🔹 Si es Android y NO es la app → Play Store
    if (/Android/i.test(userAgent)) {
      return res.redirect(302, PLAY_STORE_URL);
    }

    // 🔹 iOS / Desktop / crawlers → redirección limpia
    return res.redirect(302, PLAY_STORE_URL);

  } catch (err) {
    console.error("DEEPLINK ERROR:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
