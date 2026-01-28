const express = require("express");
const router = express.Router();
const { Establecimiento } = require("../models");

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

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

    return res.send(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${establecimiento.nombre}</title>
        </head>
        <body>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("DEEPLINK ERROR:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
