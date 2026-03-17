const { getAiServiceStatus, setAiServiceStatus } = require("../services/falService");

const getTryOnStatus = async (req, res) => {
  try {
    const status = await getAiServiceStatus();

    return res.json({
      success: true,
      service: status.service_name,
      enabled: status.enabled,
      updated_by: status.updated_by,
      updatedAt: status.updatedAt
    });
  } catch (error) {
    console.error("getTryOnStatus error:", error);

    return res.status(500).json({
      message: "Error obteniendo estado del servicio de IA"
    });
  }
};

const updateTryOnStatus = async (req, res) => {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      return res.status(400).json({
        message: "enabled debe ser boolean"
      });
    }

    const status = await setAiServiceStatus(enabled, req.user?.id || null);

    return res.json({
      success: true,
      message: enabled
        ? "Servicio de IA activado correctamente"
        : "Servicio de IA desactivado correctamente",
      service: status.service_name,
      enabled: status.enabled,
      updated_by: status.updated_by,
      updatedAt: status.updatedAt
    });
  } catch (error) {
    console.error("updateTryOnStatus error:", error);

    return res.status(500).json({
      message: "Error actualizando estado del servicio de IA"
    });
  }
};

module.exports = {
  getTryOnStatus,
  updateTryOnStatus
};
