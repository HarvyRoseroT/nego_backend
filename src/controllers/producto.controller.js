const { Producto, Seccion, Carta } = require("../models");

exports.createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, seccion_id, activo } = req.body;

    if (!nombre || !seccion_id) {
      return res.status(400).json({ message: "Datos obligatorios faltantes" });
    }

    const seccion = await Seccion.findByPk(seccion_id);
    if (!seccion) {
      return res.status(404).json({ message: "La sección no existe" });
    }

    const carta = await Carta.findByPk(seccion.carta_id);
    if (!carta) {
      return res.status(404).json({ message: "La carta no existe" });
    }

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      seccion_id,
      establecimiento_id: carta.establecimiento_id,
      activo: activo ?? true,
      orden: 0,
      imagen_url: null
    });

    return res.status(201).json(producto);
  } catch (error) {
    console.error("Error createProducto:", error);
    return res.status(500).json({ message: "Error creando producto" });
  }
};

exports.getProductosByEstablecimiento = async (req, res) => {
  try {
    const { establecimientoId } = req.params;

    const productos = await Producto.findAll({
      where: {
        establecimiento_id: establecimientoId,
      },
      order: [["nombre", "ASC"]],
    });

    return res.json(productos);
  } catch (error) {
    console.error("Error getProductosByEstablecimiento:", error);
    return res.status(500).json({ message: "Error obteniendo productos" });
  }
};



exports.getProductosBySeccion = async (req, res) => {
  try {
    const { seccionId } = req.params;

    const productos = await Producto.findAll({
      where: { seccion_id: seccionId },
      order: [["orden", "ASC"]]
    });

    return res.json(productos);
  } catch (error) {
    console.error("Error getProductosBySeccion:", error);
    return res.status(500).json({ message: "Error obteniendo productos" });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id, {
      include: [Seccion]
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(producto);
  } catch (error) {
    console.error("Error getProductoById:", error);
    return res.status(500).json({ message: "Error obteniendo producto" });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await producto.update({
      nombre: req.body.nombre ?? producto.nombre,
      descripcion: req.body.descripcion ?? producto.descripcion,
      precio: req.body.precio ?? producto.precio,
      activo: req.body.activo ?? producto.activo
    });

    return res.json(producto);
  } catch (error) {
    console.error("Error updateProducto:", error);
    return res.status(500).json({ message: "Error actualizando producto" });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await producto.destroy();

    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error deleteProducto:", error);
    return res.status(500).json({ message: "Error eliminando producto" });
  }
};

exports.reordenarProductos = async (req, res) => {
  try {
    const productos = req.body;

    if (!Array.isArray(productos)) {
      return res.status(400).json({ message: "Formato inválido" });
    }

    await Promise.all(
      productos.map((p) =>
        Producto.update(
          { orden: p.orden },
          { where: { id: p.id } }
        )
      )
    );

    return res.json({ message: "Orden actualizado" });
  } catch (error) {
    console.error("Error reordenarProductos:", error);
    return res.status(500).json({ message: "Error reordenando productos" });
  }
};
