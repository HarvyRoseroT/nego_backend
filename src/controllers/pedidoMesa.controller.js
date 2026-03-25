const {
  sequelize,
  UsuarioApp,
  Establecimiento,
  Carta,
  Producto,
  PlanoElemento,
  PlanoEstablecimiento,
  PedidoMesa,
  PedidoMesaItem
} = require("../models");

const isPositiveInteger = (value) =>
  Number.isInteger(value) && value > 0;

const getMesaPublica = (mesaId) =>
  PlanoElemento.findOne({
    where: {
      id: mesaId,
      tipo: "mesa"
    },
    include: [
      {
        model: PlanoEstablecimiento,
        as: "plano",
        include: [
          {
            model: Establecimiento,
            as: "establecimiento",
            where: { activo: true }
          }
        ]
      }
    ]
  });

exports.getMesaPedidoContexto = async (req, res) => {
  try {
    const mesa = await getMesaPublica(req.params.mesaId);

    if (!mesa) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    const cartas = await Carta.findAll({
      where: {
        establecimiento_id: mesa.plano.establecimiento.id,
        activa: true
      },
      attributes: ["id", "nombre", "orden"],
      order: [["orden", "ASC"]]
    });

    return res.json({
      mesa: {
        id: mesa.id,
        nombre: mesa.nombre,
        capacidad: mesa.capacidad
      },
      plano: {
        id: mesa.plano.id,
        nombre: mesa.plano.nombre
      },
      establecimiento: {
        id: mesa.plano.establecimiento.id,
        nombre: mesa.plano.establecimiento.nombre,
        slug: mesa.plano.establecimiento.slug,
        descripcion: mesa.plano.establecimiento.descripcion,
        logo_url: mesa.plano.establecimiento.logo_url,
        tipo_establecimiento: mesa.plano.establecimiento.tipo_establecimiento
      },
      cartas
    });
  } catch (error) {
    console.error("getMesaPedidoContexto:", error);
    return res.status(500).json({ message: "Error obteniendo la mesa" });
  }
};

exports.createPedidoMesa = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const mesa = await getMesaPublica(req.params.mesaId);

    if (!mesa) {
      await transaction.rollback();
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    const { usuario_app_id, cliente_nombre, cliente_telefono, notas } = req.body;
    const items = Array.isArray(req.body.items) ? req.body.items : null;

    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Debes enviar al menos un producto"
      });
    }

    if (usuario_app_id) {
      const usuario = await UsuarioApp.findByPk(usuario_app_id, { transaction });

      if (!usuario) {
        await transaction.rollback();
        return res.status(404).json({ message: "Usuario app no encontrado" });
      }
    }

    const normalizedItems = items.map((item) => ({
      producto_id: Number(item.producto_id),
      cantidad: Number(item.cantidad),
      notas: item.notas ?? null
    }));

    const invalidItem = normalizedItems.find(
      (item) =>
        !isPositiveInteger(item.producto_id) || !isPositiveInteger(item.cantidad)
    );

    if (invalidItem) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Cada item debe tener producto_id y cantidad validos"
      });
    }

    const productoIds = [...new Set(normalizedItems.map((item) => item.producto_id))];

    const productos = await Producto.findAll({
      where: {
        id: productoIds,
        establecimiento_id: mesa.plano.establecimiento.id,
        activo: true
      },
      transaction
    });

    if (productos.length !== productoIds.length) {
      const encontrados = new Set(productos.map((producto) => producto.id));
      const faltantes = productoIds.filter((id) => !encontrados.has(id));

      await transaction.rollback();
      return res.status(400).json({
        message: "Hay productos invalidos para esta mesa",
        producto_ids_invalidos: faltantes
      });
    }

    const productosMap = new Map(
      productos.map((producto) => [producto.id, producto])
    );

    let total = 0;

    const pedidoItems = normalizedItems.map((item) => {
      const producto = productosMap.get(item.producto_id);
      const precioUnitario = Number(producto.precio);
      const subtotal = precioUnitario * item.cantidad;

      total += subtotal;

      return {
        producto_id: producto.id,
        nombre_producto: producto.nombre,
        precio_unitario: precioUnitario.toFixed(2),
        cantidad: item.cantidad,
        subtotal: subtotal.toFixed(2),
        notas: item.notas
      };
    });

    const pedido = await PedidoMesa.create(
      {
        establecimiento_id: mesa.plano.establecimiento.id,
        plano_id: mesa.plano.id,
        mesa_id: mesa.id,
        usuario_app_id: usuario_app_id ?? null,
        mesa_nombre: mesa.nombre,
        cliente_nombre: cliente_nombre ?? null,
        cliente_telefono: cliente_telefono ?? null,
        notas: notas ?? null,
        total: total.toFixed(2)
      },
      { transaction }
    );

    await PedidoMesaItem.bulkCreate(
      pedidoItems.map((item) => ({
        ...item,
        pedido_mesa_id: pedido.id
      })),
      { transaction }
    );

    await transaction.commit();

    const pedidoCompleto = await PedidoMesa.findByPk(pedido.id, {
      include: [
        {
          model: PedidoMesaItem,
          as: "items"
        }
      ]
    });

    return res.status(201).json(pedidoCompleto);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("createPedidoMesa:", error);
    return res.status(500).json({ message: "Error creando el pedido" });
  }
};
