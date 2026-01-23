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
const stripeWebhook = require("./controllers/stripeWebhook.controller");
const billingRoutes = require("./routes/billing.routes");

const usuarioAppRoutes = require("./routes/usuarioApp.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();

app.use(cors());
app.use(morgan("dev"));


app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

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

module.exports = app;
