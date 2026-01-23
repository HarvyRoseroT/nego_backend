const { Seccion, Carta } = require("../models");


exports.createSeccion = async (req, res) => {
  try {
    const { nombre, carta_id, orden } = req.body;

    if (!nombre || !carta_id) {
      return res.status(400).json({ message: "Datos obligatorios faltantes" });
    }

    const carta = await Carta.findByPk(carta_id);
    if (!carta) {
      return res.status(400).json({ message: "La carta no existe" });
    }

    const seccion = await Seccion.create({
      nombre,
      carta_id,
      orden: orden ?? 0,
    });

    return res.status(201).json(seccion);
  } catch (error) {
    console.error("Error createSeccion:", error);
    return res.status(500).json({ message: "Error creando sección" });
  }
};


exports.getSeccionesByCarta = async (req, res) => {
  try {
    const { cartaId } = req.params;

    const secciones = await Seccion.findAll({
      where: { carta_id: cartaId },
      order: [["orden", "ASC"]],
    });

    return res.json(secciones);
  } catch (error) {
    console.error("Error getSeccionesByCarta:", error);
    return res.status(500).json({ message: "Error obteniendo secciones" });
  }
};


exports.getSeccionById = async (req, res) => {
  try {
    const { id } = req.params;

    const seccion = await Seccion.findByPk(id);

    if (!seccion) {
      return res.status(404).json({ message: "Sección no encontrada" });
    }

    return res.json(seccion);
  } catch (error) {
    console.error("Error getSeccionById:", error);
    return res.status(500).json({ message: "Error obteniendo sección" });
  }
};


exports.updateSeccion = async (req, res) => {
  try {
    const { id } = req.params;

    const seccion = await Seccion.findByPk(id);

    if (!seccion) {
      return res.status(404).json({ message: "Sección no encontrada" });
    }

    await seccion.update(req.body);

    return res.json(seccion);
  } catch (error) {
    console.error("Error updateSeccion:", error);
    return res.status(500).json({ message: "Error actualizando sección" });
  }
};


exports.deleteSeccion = async (req, res) => {
  try {
    const { id } = req.params;

    const seccion = await Seccion.findByPk(id);

    if (!seccion) {
      return res.status(404).json({ message: "Sección no encontrada" });
    }

    await seccion.destroy();

    return res.json({ message: "Sección eliminada correctamente" });
  } catch (error) {
    console.error("Error deleteSeccion:", error);
    return res.status(500).json({ message: "Error eliminando sección" });
  }
};

exports.reordenarSecciones = async (req, res) => {
  try {
    const secciones = req.body;

    if (!Array.isArray(secciones)) {
      return res.status(400).json({ message: "Formato inválido" });
    }

    const updates = secciones.map((s) =>
      Seccion.update(
        { orden: s.orden },
        { where: { id: s.id } }
      )
    );

    await Promise.all(updates);

    return res.json({ message: "Orden actualizado" });
  } catch (error) {
    console.error("Error reordenarSecciones:", error);
    return res.status(500).json({ message: "Error reordenando secciones" });
  }
};
