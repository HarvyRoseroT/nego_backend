const { Plan } = require("../models");

exports.getPlanes = async (req, res) => {
  try {
    const planes = await Plan.findAll({
      where: { is_active: true },
      attributes: [
        "id",
        "name",
        "price",
        "currency",
        "interval",
        "duration_days"
      ],
      order: [["price", "ASC"]]
    });

    res.status(200).json(planes);
  } catch (error) {
    console.error("Error getPlanes:", error);
    res.status(500).json({ message: "Error al obtener planes" });
  }
};
