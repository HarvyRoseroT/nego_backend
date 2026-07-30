const { Op } = require("sequelize");
const { Establecimiento, Plan, Subscription, User } = require("../models");

const parsePositiveInt = (value, fallback, max = 100) => {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
};

const parseBooleanFilter = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === "true" || value === true) {
    return true;
  }

  if (value === "false" || value === false) {
    return false;
  }

  return undefined;
};

const buildEstablecimientoWhere = (query) => {
  const where = {};
  const activo = parseBooleanFilter(query.activo);

  if (activo !== undefined) {
    where.activo = activo;
  }

  if (query.ciudad) {
    where.ciudad = { [Op.iLike]: `%${query.ciudad}%` };
  }

  if (query.pais) {
    where.pais = { [Op.iLike]: `%${query.pais}%` };
  }

  if (query.tipo_establecimiento) {
    where.tipo_establecimiento = query.tipo_establecimiento;
  }

  if (query.search) {
    const search = `%${query.search}%`;

    where[Op.or] = [
      { nombre: { [Op.iLike]: search } },
      { slug: { [Op.iLike]: search } },
      { ciudad: { [Op.iLike]: search } },
      { pais: { [Op.iLike]: search } },
    ];
  }

  return where;
};

const ownerInclude = {
  model: User,
  attributes: ["id", "name", "email", "isActive", "emailVerified", "createdAt"],
  include: [
    {
      model: Subscription,
      attributes: [
        "id",
        "status",
        "plan_id",
        "plan_price",
        "currency",
        "current_period_start",
        "current_period_end",
        "next_billing_date",
        "cancel_at_period_end",
      ],
      include: [
        {
          model: Plan,
          attributes: ["id", "name", "price", "currency", "interval"],
        },
      ],
      required: false,
    },
  ],
};

const formatEstablecimiento = (establecimiento) => {
  const plain = establecimiento.get({ plain: true });
  const owner = plain.User || null;
  const subscription = owner?.Subscription || null;

  return {
    id: plain.id,
    user_id: plain.user_id,
    slug: plain.slug,
    nombre: plain.nombre,
    descripcion: plain.descripcion,
    direccion: plain.direccion,
    ciudad: plain.ciudad,
    pais: plain.pais,
    telefono_contacto: plain.telefono_contacto,
    lat: plain.lat,
    lng: plain.lng,
    logo_url: plain.logo_url,
    imagen_ubicacion_url: plain.imagen_ubicacion_url,
    activo: plain.activo,
    verificado: plain.verificado,
    domicilio_activo: plain.domicilio_activo,
    tipo_establecimiento: plain.tipo_establecimiento,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
    owner: owner
      ? {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          isActive: owner.isActive,
          emailVerified: owner.emailVerified,
          createdAt: owner.createdAt,
        }
      : null,
    subscription: subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          plan_id: subscription.plan_id,
          plan_price: subscription.plan_price,
          currency: subscription.currency,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          next_billing_date: subscription.next_billing_date,
          cancel_at_period_end: subscription.cancel_at_period_end,
          plan: subscription.Plan
            ? {
                id: subscription.Plan.id,
                name: subscription.Plan.name,
                price: subscription.Plan.price,
                currency: subscription.Plan.currency,
                interval: subscription.Plan.interval,
              }
            : null,
        }
      : null,
  };
};

exports.listEstablecimientos = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 20);
    const offset = (page - 1) * limit;

    const { rows, count } = await Establecimiento.findAndCountAll({
      where: buildEstablecimientoWhere(req.query),
      include: [ownerInclude],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    return res.json({
      data: rows.map(formatEstablecimiento),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("SUPERADMIN LIST ESTABLECIMIENTOS ERROR:", error);
    return res.status(500).json({
      message: "Error obteniendo establecimientos",
    });
  }
};

exports.getEstablecimientoById = async (req, res) => {
  try {
    const establecimiento = await Establecimiento.findByPk(req.params.id, {
      include: [ownerInclude],
    });

    if (!establecimiento) {
      return res.status(404).json({ message: "Establecimiento no encontrado" });
    }

    return res.json(formatEstablecimiento(establecimiento));
  } catch (error) {
    console.error("SUPERADMIN GET ESTABLECIMIENTO ERROR:", error);
    return res.status(500).json({
      message: "Error obteniendo establecimiento",
    });
  }
};

exports.updateEstablecimientoVerificado = async (req, res) => {
  try {
    if (typeof req.body.verificado !== "boolean") {
      return res.status(400).json({
        message: "El campo verificado debe ser booleano",
      });
    }

    const establecimiento = await Establecimiento.findByPk(req.params.id);

    if (!establecimiento) {
      return res.status(404).json({ message: "Establecimiento no encontrado" });
    }

    await establecimiento.update({
      verificado: req.body.verificado,
    });

    const updated = await Establecimiento.findByPk(req.params.id, {
      include: [ownerInclude],
    });

    return res.json(formatEstablecimiento(updated));
  } catch (error) {
    console.error("SUPERADMIN UPDATE ESTABLECIMIENTO VERIFICADO ERROR:", error);
    return res.status(500).json({
      message: "Error actualizando verificacion del establecimiento",
    });
  }
};
