const { Establecimiento } = require("../models");
const haversine = require("../utils/haversine");

exports.nearby = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    const establecimientos = await Establecimiento.findAll({
      where: { activo: true }
    });

    const result = establecimientos
      .map((e) => {
        const distance = haversine(
          parseFloat(lat),
          parseFloat(lng),
          e.lat,
          e.lng
        );

        return { ...e.toJSON(), distance };
      })
      .filter((e) => e.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Nearby search error" });
  }
};
