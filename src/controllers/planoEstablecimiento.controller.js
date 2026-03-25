const {
  Establecimiento,
  PlanoEstablecimiento,
  PlanoElemento
} = require("../models");

const TIPOS_ELEMENTO = ["mesa", "objeto_cuadrado"];

const isPositiveNumber = (value) =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isValidNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);

const getOwnedEstablecimiento = (establecimientoId, userId) =>
  Establecimiento.findOne({
    where: {
      id: establecimientoId,
      user_id: userId
    }
  });

const getOwnedPlano = async (planoId, userId) =>
  PlanoEstablecimiento.findOne({
    where: { id: planoId },
    include: [
      {
        model: Establecimiento,
        as: "establecimiento",
        where: { user_id: userId },
        attributes: []
      },
      {
        model: PlanoElemento,
        as: "elementos"
      }
    ],
    order: [[{ model: PlanoElemento, as: "elementos" }, "id", "ASC"]]
  });

const getOwnedPlanosByEstablecimiento = (establecimientoId) =>
  PlanoEstablecimiento.findAll({
    where: { establecimiento_id: establecimientoId },
    include: [{ model: PlanoElemento, as: "elementos" }],
    order: [
      ["id", "ASC"],
      [{ model: PlanoElemento, as: "elementos" }, "id", "ASC"]
    ]
  });

const validatePlanoPayload = ({ ancho, alto }) => {
  if (!isPositiveNumber(ancho) || !isPositiveNumber(alto)) {
    return "Las dimensiones del plano deben ser numeros positivos";
  }

  return null;
};

const validateElementoPayload = ({
  tipo,
  nombre,
  capacidad,
  posicion_x,
  posicion_y,
  ancho,
  alto
}) => {
  if (!TIPOS_ELEMENTO.includes(tipo)) {
    return "Tipo de elemento invalido";
  }

  if (!nombre || typeof nombre !== "string") {
    return "El nombre del elemento es obligatorio";
  }

  if (!isValidNumber(posicion_x) || !isValidNumber(posicion_y)) {
    return "La posicion del elemento es invalida";
  }

  if (!isPositiveNumber(ancho) || !isPositiveNumber(alto)) {
    return "Las dimensiones del elemento deben ser numeros positivos";
  }

  if (tipo === "mesa") {
    if (!Number.isInteger(capacidad) || capacidad <= 0) {
      return "La capacidad de la mesa debe ser un entero positivo";
    }
  }

  if (tipo === "objeto_cuadrado" && capacidad !== undefined && capacidad !== null) {
    return "Los objetos cuadrados no pueden tener capacidad";
  }

  return null;
};

exports.create = async (req, res) => {
  try {
    const { establecimiento_id, nombre, ancho, alto } = req.body;

    if (!establecimiento_id) {
      return res.status(400).json({
        message: "establecimiento_id es obligatorio"
      });
    }

    const establecimiento = await getOwnedEstablecimiento(
      establecimiento_id,
      req.user.id
    );

    if (!establecimiento) {
      return res.status(403).json({ message: "Access denied" });
    }

    const validationError = validatePlanoPayload({ ancho, alto });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const plano = await PlanoEstablecimiento.create({
      establecimiento_id,
      nombre: nombre || "Plano principal",
      ancho,
      alto
    });

    const planoCompleto = await PlanoEstablecimiento.findByPk(plano.id, {
      include: [{ model: PlanoElemento, as: "elementos" }]
    });

    res.status(201).json(planoCompleto);
  } catch (error) {
    console.error("CREATE PLANO ERROR:", error);
    res.status(500).json({ message: "Create plano error" });
  }
};

exports.getByEstablecimiento = async (req, res) => {
  try {
    const { establecimientoId } = req.params;

    const establecimiento = await getOwnedEstablecimiento(
      establecimientoId,
      req.user.id
    );

    if (!establecimiento) {
      return res.status(403).json({ message: "Access denied" });
    }

    const planos = await getOwnedPlanosByEstablecimiento(establecimientoId);

    res.json(planos);
  } catch (error) {
    console.error("GET PLANO ERROR:", error);
    res.status(500).json({ message: "Get plano error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const plano = await getOwnedPlano(req.params.id, req.user.id);

    if (!plano) {
      return res.status(404).json({ message: "Plano not found" });
    }

    res.json(plano);
  } catch (error) {
    console.error("GET PLANO BY ID ERROR:", error);
    res.status(500).json({ message: "Get plano error" });
  }
};

exports.update = async (req, res) => {
  try {
    const plano = await getOwnedPlano(req.params.id, req.user.id);

    if (!plano) {
      return res.status(404).json({ message: "Plano not found" });
    }

    const nextAncho = req.body.ancho ?? plano.ancho;
    const nextAlto = req.body.alto ?? plano.alto;
    const validationError = validatePlanoPayload({
      ancho: nextAncho,
      alto: nextAlto
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await plano.update({
      nombre: req.body.nombre ?? plano.nombre,
      ancho: nextAncho,
      alto: nextAlto
    });

    const planoActualizado = await getOwnedPlano(req.params.id, req.user.id);
    res.json(planoActualizado);
  } catch (error) {
    console.error("UPDATE PLANO ERROR:", error);
    res.status(500).json({ message: "Update plano error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const plano = await getOwnedPlano(req.params.id, req.user.id);

    if (!plano) {
      return res.status(404).json({ message: "Plano not found" });
    }

    await plano.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error("DELETE PLANO ERROR:", error);
    res.status(500).json({ message: "Delete plano error" });
  }
};

exports.createElemento = async (req, res) => {
  try {
    const plano = await getOwnedPlano(req.params.planoId, req.user.id);

    if (!plano) {
      return res.status(404).json({ message: "Plano not found" });
    }

    const validationError = validateElementoPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const elemento = await PlanoElemento.create({
      plano_id: plano.id,
      tipo: req.body.tipo,
      nombre: req.body.nombre,
      capacidad: req.body.tipo === "mesa" ? req.body.capacidad : null,
      posicion_x: req.body.posicion_x,
      posicion_y: req.body.posicion_y,
      ancho: req.body.ancho,
      alto: req.body.alto
    });

    res.status(201).json(elemento);
  } catch (error) {
    console.error("CREATE ELEMENTO PLANO ERROR:", error);
    res.status(500).json({ message: "Create plano elemento error" });
  }
};

exports.updateElemento = async (req, res) => {
  try {
    const plano = await getOwnedPlano(req.params.planoId, req.user.id);

    if (!plano) {
      return res.status(404).json({ message: "Plano not found" });
    }

    const elemento = await PlanoElemento.findOne({
      where: {
        id: req.params.elementoId,
        plano_id: plano.id
      }
    });

    if (!elemento) {
      return res.status(404).json({ message: "Elemento not found" });
    }

    const payload = {
      tipo: req.body.tipo ?? elemento.tipo,
      nombre: req.body.nombre ?? elemento.nombre,
      capacidad:
        req.body.capacidad !== undefined ? req.body.capacidad : elemento.capacidad,
      posicion_x: req.body.posicion_x ?? elemento.posicion_x,
      posicion_y: req.body.posicion_y ?? elemento.posicion_y,
      ancho: req.body.ancho ?? elemento.ancho,
      alto: req.body.alto ?? elemento.alto
    };

    const validationError = validateElementoPayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await elemento.update({
      ...payload,
      capacidad: payload.tipo === "mesa" ? payload.capacidad : null
    });

    res.json(elemento);
  } catch (error) {
    console.error("UPDATE ELEMENTO PLANO ERROR:", error);
    res.status(500).json({ message: "Update plano elemento error" });
  }
};

exports.deleteElemento = async (req, res) => {
  try {
    const plano = await getOwnedPlano(req.params.planoId, req.user.id);

    if (!plano) {
      return res.status(404).json({ message: "Plano not found" });
    }

    const elemento = await PlanoElemento.findOne({
      where: {
        id: req.params.elementoId,
        plano_id: plano.id
      }
    });

    if (!elemento) {
      return res.status(404).json({ message: "Elemento not found" });
    }

    await elemento.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error("DELETE ELEMENTO PLANO ERROR:", error);
    res.status(500).json({ message: "Delete plano elemento error" });
  }
};
