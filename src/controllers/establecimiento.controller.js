const { Establecimiento } = require("../models");

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const generateUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let counter = 1;

  while (await Establecimiento.findOne({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

exports.create = async (req, res) => {
  try {
    const exists = await Establecimiento.findOne({
      where: { user_id: req.user.id }
    });

    if (exists) {
      return res.status(400).json({
        message: "User already has an establishment"
      });
    }

    const {
      nombre,
      descripcion,
      direccion,
      ciudad,
      pais,
      telefono_contacto,
      lat,
      lng,
      logo_url,
      imagen_ubicacion_url,
      domicilio_activo,
      tipo_establecimiento
    } = req.body;

    if (!nombre || !direccion || !ciudad || !pais) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const allowedTypes = [
      "restaurant",
      "cafe",
      "dark_kitchen",
      "bar",
      "clothing_store"
    ];

    if (
      tipo_establecimiento &&
      !allowedTypes.includes(tipo_establecimiento)
    ) {
      return res.status(400).json({
        message: "Invalid tipo_establecimiento"
      });
    }

    const baseSlug = slugify(nombre);
    const slug = await generateUniqueSlug(baseSlug);

    const establecimiento = await Establecimiento.create({
      user_id: req.user.id,
      slug,
      nombre,
      descripcion,
      direccion,
      ciudad,
      pais,
      telefono_contacto: telefono_contacto || null,
      lat,
      lng,
      logo_url: logo_url || null,
      imagen_ubicacion_url: imagen_ubicacion_url || null,
      domicilio_activo:
        domicilio_activo !== undefined ? domicilio_activo : true,
      tipo_establecimiento: tipo_establecimiento || "restaurant"
    });

    res.status(201).json(establecimiento);
  } catch (error) {
    console.error("CREATE ESTABLECIMIENTO ERROR:", error);
    res.status(500).json({ message: "Create error" });
  }
};

exports.getMine = async (req, res) => {
  try {
    const establecimiento = await Establecimiento.findOne({
      where: { user_id: req.user.id }
    });

    if (!establecimiento) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(establecimiento);
  } catch (error) {
    res.status(500).json({ message: "Fetch error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const establecimiento = await Establecimiento.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!establecimiento) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(establecimiento);
  } catch (error) {
    res.status(500).json({ message: "Fetch error" });
  }
};

exports.update = async (req, res) => {
  try {
    const establecimiento = await Establecimiento.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!establecimiento) {
      return res.status(404).json({ message: "Not found" });
    }

    if ("pais" in req.body && (!req.body.pais || req.body.pais === "")) {
      return res.status(400).json({
        message: "Pais is required"
      });
    }

    const allowedTypes = [
      "restaurant",
      "cafe",
      "dark_kitchen",
      "bar",
      "clothing_store"
    ];

    if (
      req.body.tipo_establecimiento &&
      !allowedTypes.includes(req.body.tipo_establecimiento)
    ) {
      return res.status(400).json({
        message: "Invalid tipo_establecimiento"
      });
    }

    let slug = establecimiento.slug;

    if (req.body.nombre && req.body.nombre !== establecimiento.nombre) {
      const baseSlug = slugify(req.body.nombre);
      slug = await generateUniqueSlug(baseSlug);
    }

    await establecimiento.update({
      slug,
      nombre: req.body.nombre ?? establecimiento.nombre,
      descripcion: req.body.descripcion ?? establecimiento.descripcion,
      direccion: req.body.direccion ?? establecimiento.direccion,
      ciudad: req.body.ciudad ?? establecimiento.ciudad,
      pais: req.body.pais ?? establecimiento.pais,
      telefono_contacto:
        req.body.telefono_contacto ?? establecimiento.telefono_contacto,
      lat: req.body.lat ?? establecimiento.lat,
      lng: req.body.lng ?? establecimiento.lng,
      logo_url: req.body.logo_url ?? establecimiento.logo_url,
      imagen_ubicacion_url:
        req.body.imagen_ubicacion_url ?? establecimiento.imagen_ubicacion_url,
      activo:
        req.body.activo !== undefined
          ? req.body.activo
          : establecimiento.activo,
      domicilio_activo:
        req.body.domicilio_activo ?? establecimiento.domicilio_activo,
      tipo_establecimiento:
        req.body.tipo_establecimiento ??
        establecimiento.tipo_establecimiento
    });

    res.json(establecimiento);
  } catch (error) {
    console.error("UPDATE ESTABLECIMIENTO ERROR:", error);
    res.status(500).json({ message: "Update error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const establecimiento = await Establecimiento.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!establecimiento) {
      return res.status(404).json({ message: "Not found" });
    }

    await establecimiento.destroy();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete error" });
  }
};
