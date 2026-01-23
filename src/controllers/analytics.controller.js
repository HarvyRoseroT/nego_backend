const AnalyticsEvent = require("../models/AnalyticsEvent");

const trackEvent = async (req, res) => {
  try {
    const {
      event_type,
      establecimiento_id,
      carta_id,
      seccion_id,
      producto_id,
      device_id,
      origen,
    } = req.body;

    if (!event_type || !establecimiento_id || !device_id) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      null;

    const user_agent = req.headers["user-agent"] || null;

    const lastEvent = await AnalyticsEvent.findOne({
      where: {
        event_type,
        establecimiento_id,
        device_id,
      },
      order: [["created_at", "DESC"]],
    });

    if (lastEvent) {
      const diff =
        Date.now() - new Date(lastEvent.created_at).getTime();

      if (diff < 15000) {
        return res.json({ ok: true });
      }
    }

    await AnalyticsEvent.create({
      event_type,
      establecimiento_id,
      carta_id: carta_id || null,
      seccion_id: seccion_id || null,
      producto_id: producto_id || null,
      device_id,
      origen: origen || null,
      ip,
      user_agent,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Error registrando evento" });
  }
};

module.exports = {
  trackEvent,
};
