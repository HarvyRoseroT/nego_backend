const { Plan } = require("../models");

exports.getPlanes = async (req, res) => {
  try {
    const planes = await Plan.findAll({
      where: { is_active: true },
      order: [["price", "ASC"]],
    });

    const formatted = planes.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: Number(plan.price),
      currency: plan.currency,
      interval: plan.interval,
      duration_days: plan.duration_days,
      is_active: plan.is_active,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error getPlanes:", error);
    return res.status(500).json({ message: "Error al obtener planes" });
  }
};
