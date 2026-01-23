const { Carta, Establecimiento, Seccion, Producto, sequelize } = require("../models");

exports.create = async (req, res) => {
  try {
    const { establecimiento_id, nombre } = req.body;

    const establecimiento = await Establecimiento.findOne({
      where: {
        id: establecimiento_id,
        user_id: req.user.id
      }
    });

    if (!establecimiento) {
      return res.status(403).json({ message: "Access denied" });
    }

    const carta = await Carta.create({
      nombre,
      establecimiento_id
    });

    res.status(201).json(carta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Create carta error" });
  }
};

exports.listByEstablecimiento = async (req, res) => {
  try {
    const { establecimientoId } = req.params;

    const cartas = await Carta.findAll({
      where: { establecimiento_id: establecimientoId },
      order: [["orden", "ASC"]],
    });

    res.json(cartas);
  } catch (error) {
    console.error("LIST CARTAS ERROR:", error);
    res.status(500).json({ message: "List cartas error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const carta = await Carta.findOne({
      where: { id },
      include: [
        {
          model: Establecimiento,
          as: "establecimiento", 
          required: true,
          where: { user_id: req.user.id },
          attributes: [],
        },
      ],
    });

    if (!carta) {
      return res.status(404).json({ message: "Carta not found" });
    }

    res.json(carta);
  } catch (error) {
    console.error("GET CARTA BY ID ERROR:", error);
    res.status(500).json({
      message: "Get carta error",
      error: error.message, 
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, activa } = req.body;

    const carta = await Carta.findByPk(id, {
      include: {
        model: Establecimiento,
        as: "establecimiento",
        where: { user_id: req.user.id }
      }
    });

    if (!carta) {
      return res.status(404).json({ message: "Carta not found" });
    }

    await carta.update({
      nombre: nombre ?? carta.nombre,
      activa: activa ?? carta.activa
    });

    res.json(carta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update carta error" });
  }
};


exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const carta = await Carta.findByPk(id, {
      include: {
        model: Establecimiento,
        as: "establecimiento",
        where: { user_id: req.user.id }
      }
    });

    if (!carta) {
      return res.status(404).json({ message: "Carta not found" });
    }

    const seccionesCount = await Seccion.count({
      where: { carta_id: id }
    });

    if (seccionesCount > 0) {
      return res.status(409).json({
        message:
          "No puedes eliminar una carta que tiene secciones o productos. Elimínalos primero o desactiva la carta."
      });
    }

    await carta.destroy();

    res.json({ message: "Carta deleted successfully" });
  } catch (error) {
    console.error("DELETE CARTA ERROR:", error);
    res.status(500).json({ message: "Delete carta error" });
  }
};


exports.deactivate = async (req, res) => {
  try {
    const { id } = req.params;

    const carta = await Carta.findByPk(id, {
      include: {
        model: Establecimiento,
        as: "establecimiento",
        where: { user_id: req.user.id }
      }
    });

    if (!carta) {
      return res.status(404).json({ message: "Carta not found" });
    }

    await carta.update({ activa: false });

    res.json({ message: "Carta deactivated successfully" });
  } catch (error) {
    console.error("DEACTIVATE CARTA ERROR:", error);
    res.status(500).json({ message: "Deactivate carta error" });
  }
};


exports.updateOrden = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { establecimiento_id, ordenes } = req.body;

    if (!Array.isArray(ordenes)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Orden inválido" });
    }

    const establecimiento = await Establecimiento.findOne({
      where: {
        id: establecimiento_id,
        user_id: req.user.id
      }
    });

    if (!establecimiento) {
      await transaction.rollback();
      return res.status(403).json({ message: "Access denied" });
    }

    for (const item of ordenes) {
      await Carta.update(
        { orden: item.orden },
        {
          where: {
            id: item.id,
            establecimiento_id
          },
          transaction
        }
      );
    }

    await transaction.commit();
    res.json({ message: "Orden actualizado" });
  } catch (error) {
    await transaction.rollback();
    console.error("UPDATE ORDEN CARTAS ERROR:", error);
    res.status(500).json({ message: "Update orden error" });
  }
};
