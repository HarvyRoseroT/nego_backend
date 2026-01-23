const { Op, fn, col, literal } = require("sequelize");
const AnalyticsEvent = require("../models/AnalyticsEvent");

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfWeek = () => {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getResumen = async (req, res) => {
  const { id } = req.params;

  const [
    visitas,
    visitasUnicas,
    visitasCartas,
    visitasHoy,
    visitasSemana,
    visitasMes,
    visitasUltimos7Dias,
    visitasUltimos30Dias,
    ultimaVisita,
  ] = await Promise.all([
    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: "VISIT_EST",
      },
    }),

    AnalyticsEvent.count({
      distinct: true,
      col: "device_id",
      where: {
        establecimiento_id: id,
        event_type: "VISIT_EST",
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: "VIEW_CARTA",
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: "VISIT_EST",
        created_at: { [Op.gte]: startOfToday() },
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: "VISIT_EST",
        created_at: { [Op.gte]: startOfWeek() },
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: "VISIT_EST",
        created_at: { [Op.gte]: startOfMonth() },
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: "VISIT_EST",
        created_at: { [Op.gte]: daysAgo(7) },
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: "VISIT_EST",
        created_at: { [Op.gte]: daysAgo(30) },
      },
    }),

    AnalyticsEvent.findOne({
      attributes: [[fn("MAX", col("created_at")), "fecha"]],
      where: {
        establecimiento_id: id,
        event_type: "VISIT_EST",
      },
      raw: true,
    }),
  ]);

  const tasaInteraccionCartas =
    visitas > 0 ? Number((visitasCartas / visitas).toFixed(2)) : 0;

  const promedioVisitasPorUsuario =
    visitasUnicas > 0 ? Number((visitas / visitasUnicas).toFixed(2)) : 0;

  res.json({
    visitas,
    visitasUnicas,
    visitasCartas,
    visitasHoy,
    visitasSemana,
    visitasMes,
    visitasUltimos7Dias,
    visitasUltimos30Dias,
    tasaInteraccionCartas,
    promedioVisitasPorUsuario,
    ultimaVisita: ultimaVisita?.fecha || null,
  });
};

const getVisitasPorDia = async (req, res) => {
  const { id } = req.params;

  const data = await AnalyticsEvent.findAll({
    attributes: [
      [fn("DATE", col("created_at")), "fecha"],
      [fn("COUNT", "*"), "total"],
    ],
    where: {
      establecimiento_id: id,
      event_type: "VISIT_EST",
    },
    group: [literal("fecha")],
    order: [[literal("fecha"), "ASC"]],
  });

  res.json(data);
};

const getOrigenVisitas = async (req, res) => {
  const { id } = req.params;

  const data = await AnalyticsEvent.findAll({
    attributes: [
      "origen",
      [fn("COUNT", "*"), "total"],
    ],
    where: {
      establecimiento_id: id,
      event_type: "VISIT_EST",
    },
    group: ["origen"],
  });

  res.json(data);
};

const getCartasTop = async (req, res) => {
  const { id } = req.params;

  const data = await AnalyticsEvent.findAll({
    attributes: [
      "carta_id",
      [fn("COUNT", "*"), "vistas"],
    ],
    where: {
      establecimiento_id: id,
      event_type: "VIEW_CARTA",
      carta_id: { [Op.not]: null },
    },
    group: ["carta_id"],
    order: [[fn("COUNT", "*"), "DESC"]],
    limit: 10,
  });

  res.json(data);
};

module.exports = {
  getResumen,
  getVisitasPorDia,
  getOrigenVisitas,
  getCartasTop,
};
