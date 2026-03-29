const express = require("express");
const router = express.Router();
const { Establecimiento } = require("../models");

const DEFAULT_ANDROID_PACKAGE_NAME = "com.hasaroo.nego";
const DEFAULT_ANDROID_SHA256 =
  "42:70:EE:47:37:39:0F:2D:59:B0:93:19:C9:2F:A2:72:AD:4F:2B:FD:04:59:84:CB:07:5A:15:3B:5A:0D:64:42";
const LANDING_BASE_URL = process.env.LANDING_BASE_URL;

const getAndroidFingerprints = () => {
  const rawFingerprints = process.env.ANDROID_APP_LINKS_SHA256;

  if (!rawFingerprints) {
    return [DEFAULT_ANDROID_SHA256];
  }

  return rawFingerprints
    .split(",")
    .map((fingerprint) => fingerprint.trim())
    .filter(Boolean);
};

const buildLandingUrl = (slug) => {
  if (!LANDING_BASE_URL) {
    return null;
  }

  const normalizedBaseUrl = LANDING_BASE_URL.endsWith("/")
    ? LANDING_BASE_URL.slice(0, -1)
    : LANDING_BASE_URL;

  return `${normalizedBaseUrl}/${slug}`;
};

router.get("/.well-known/assetlinks.json", (req, res) => {
  return res
    .type("application/json")
    .set("Cache-Control", "public, max-age=3600")
    .status(200)
    .send([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name:
            process.env.ANDROID_APP_PACKAGE_NAME || DEFAULT_ANDROID_PACKAGE_NAME,
          sha256_cert_fingerprints: getAndroidFingerprints()
        }
      }
    ]);
});

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
      where: { slug, activo: true }
    });

    if (!establecimiento) {
      return res.status(404).send("Not found");
    }

    const landingUrl = buildLandingUrl(slug);

    if (!landingUrl) {
      return res.status(500).send("Landing URL not configured");
    }

    return res.redirect(302, landingUrl);
  } catch (err) {
    console.error("DEEPLINK ERROR:", err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
