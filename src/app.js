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
const billingRoutes = require("./routes/billing.routes");
const partnerRoutes = require("./routes/partner.routes");
const partnerPanelRoutes = require("./routes/partner.panel.routes");

const usuarioAppRoutes = require("./routes/usuarioApp.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const deepLinkRoutes = require("./routes/deeplink.routes");
const aiRoutes = require("./routes/aiRoutes.routes");

const wompiWebhook = require("./routes/webhook.routes");

const app = express();

app.use(
  cors({
    origin: [
      "https://panel.nego.ink",
      "http://localhost:3001",
      "https://open.nego.ink",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/webhooks/wompi", wompiWebhook);

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
app.use("/api/billing", billingRoutes);
app.use("/app", usuarioAppRoutes);
app.use("/app/analytics", analyticsRoutes);
app.use("/", deepLinkRoutes);
app.use("/app/api/ai", aiRoutes);

app.use("/api/partner", partnerRoutes);
app.use("/api/partner/panel", partnerPanelRoutes);

app.use((err, req, res, next) => {
  if (err instanceof Error && err.message === "Formato de imagen no permitido") {
    return res.status(err.statusCode || 400).json({
      message: err.message
    });
  }

  if (err?.name === "MulterError") {
    return res.status(400).json({
      message: err.message
    });
  }

  return next(err);
});

module.exports = app;
