const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const establecimientoRoutes = require("./routes/establecimiento.routes");
const publicRoutes = require("./routes/public.routes");
const cartaRoutes = require("./routes/carta.routes");
const seccionRoutes = require("./routes/seccion.routes");
const productoRoutes = require("./routes/producto.routes");
const planRoutes = require("./routes/plan.routes");
const analyticsStatsRoutes = require("./routes/analytics.stats.routes");
const stripeRoutes = require("./routes/stripe.routes");
const stripeWebhook = require("./routes/stripeWebhook.routes");
const billingRoutes = require("./routes/billing.routes");

const usuarioAppRoutes = require("./routes/usuarioApp.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const deepLinkRoutes = require("./routes/deeplink.routes")

const app = express();

app.use(
  cors({
    origin: [
      "https://panel.nego.ink",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use("/api/stripe/webhook", stripeWebhook);


app.get("/.well-known/assetlinks.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json([
    {
      relation: [
        "delegate_permission/common.handle_all_urls",
        "delegate_permission/common.get_login_creds"
      ],
      target: {
        namespace: "android_app",
        package_name: "com.hasaroo.nego",
        sha256_cert_fingerprints: [
          "74:FE:A0:41:BD:3B:7C:17:9E:1F:80:82:61:EA:32:98:40:13:95:16:27:61:D1:2C:C3:57:B2:87:C1:EB:3F:EA"
        ]
      }
    }
  ]);
});



app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "nego-api",
    version: "v1"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/establecimientos", establecimientoRoutes);
app.use("/public", publicRoutes);
app.use("/api/cartas", cartaRoutes);
app.use("/api/secciones", seccionRoutes);
app.use("/api/productos", productoRoutes);
app.use("/planes", planRoutes);
app.use("/dashboard/analytics", analyticsStatsRoutes);

app.use("/api/stripe", stripeRoutes);
app.use("/api/billing", billingRoutes);

app.use("/app", usuarioAppRoutes);
app.use("/app/analytics", analyticsRoutes);

app.use("/", deepLinkRoutes);

module.exports = app;
