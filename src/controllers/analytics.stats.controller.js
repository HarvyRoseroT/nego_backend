const { Op, fn, col, literal } = require("sequelize");
const { Producto } = require("../models");
const AnalyticsEvent = require("../models/AnalyticsEvent");
const ANALYTICS_EVENTS = require("../constants/analyticsEvents");

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
        event_type: ANALYTICS_EVENTS.VISIT_EST,
      },
    }),

    AnalyticsEvent.count({
      distinct: true,
      col: "device_id",
      where: {
        establecimiento_id: id,
        event_type: ANALYTICS_EVENTS.VISIT_EST,
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: ANALYTICS_EVENTS.VIEW_CARTA,
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: ANALYTICS_EVENTS.VISIT_EST,
        created_at: { [Op.gte]: startOfToday() },
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: ANALYTICS_EVENTS.VISIT_EST,
        created_at: { [Op.gte]: startOfWeek() },
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: ANALYTICS_EVENTS.VISIT_EST,
        created_at: { [Op.gte]: startOfMonth() },
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: ANALYTICS_EVENTS.VISIT_EST,
        created_at: { [Op.gte]: daysAgo(7) },
      },
    }),

    AnalyticsEvent.count({
      where: {
        establecimiento_id: id,
        event_type: ANALYTICS_EVENTS.VISIT_EST,
        created_at: { [Op.gte]: daysAgo(30) },
      },
    }),

    AnalyticsEvent.findOne({
      attributes: [[fn("MAX", col("created_at")), "fecha"]],
      where: {
        establecimiento_id: id,
        event_type: ANALYTICS_EVENTS.VISIT_EST,
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
      event_type: ANALYTICS_EVENTS.VISIT_EST,
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
      event_type: ANALYTICS_EVENTS.VISIT_EST,
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
      event_type: ANALYTICS_EVENTS.VIEW_CARTA,
      carta_id: { [Op.not]: null },
    },
    group: ["carta_id"],
    order: [[fn("COUNT", "*"), "DESC"]],
    limit: 10,
  });

  res.json(data);
};

const getTopProductosByEventType = async (establecimientoId, eventType) => {
  const data = await AnalyticsEvent.findAll({
    attributes: [
      "producto_id",
      [fn("COUNT", "*"), "total"],
    ],
    where: {
      establecimiento_id: establecimientoId,
      event_type: eventType,
      producto_id: { [Op.not]: null },
    },
    group: ["producto_id"],
    order: [[literal("total"), "DESC"]],
    limit: 10,
    raw: true,
  });

  if (!data.length) {
    return [];
  }

  const productos = await Producto.findAll({
    where: {
      id: data.map(item => item.producto_id),
    },
    attributes: [
      "id",
      "nombre",
      "precio",
      "imagen_url",
      "marca",
      "talla",
      "tipo_producto",
    ],
    raw: true,
  });

  const productosMap = new Map(
    productos.map(producto => [String(producto.id), producto])
  );

  return data.map(item => ({
    producto_id: item.producto_id,
    total: Number(item.total),
    producto: productosMap.get(String(item.producto_id)) || null,
  }));
};

const getProductosTop = async (req, res) => {
  const { id } = req.params;

  const data = await getTopProductosByEventType(
    id,
    ANALYTICS_EVENTS.VIEW_PRODUCT
  );

  res.json(data);
};

const getProductosDomicilioTop = async (req, res) => {
  const { id } = req.params;

  const data = await getTopProductosByEventType(
    id,
    ANALYTICS_EVENTS.WHATSAPP_PRODUCT_ORDER
  );

  res.json(data);
};

module.exports = {
  getResumen,
  getVisitasPorDia,
  getOrigenVisitas,
  getCartasTop,
  getProductosTop,
  getProductosDomicilioTop,
};
