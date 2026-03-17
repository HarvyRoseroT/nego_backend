const {
  UsuarioApp,
  Establecimiento,
  Carta,
  Seccion,
  Producto
} = require("../models");
const sharp = require("sharp");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

const haversineDistance = require("../utils/haversine");

exports.initUsuarioApp = async (req, res) => {
  try {
    const { deviceId, lat, lng, platform, pushToken } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId required" });
    }

    let usuario = await UsuarioApp.findOne({ where: { deviceId } });

    if (!usuario) {
      usuario = await UsuarioApp.create({
        deviceId,
        lat,
        lng,
        platform,
        pushToken,
        isGuest: true,
        lastAccess: new Date()
      });
    } else {
      await usuario.update({
        lat,
        lng,
        platform,
        pushToken,
        lastAccess: new Date()
      });
    }

    res.json(usuario);
  } catch (error) {
    console.error("initUsuarioApp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.subirImagenUsuarioApp = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No se envio imagen" });
    }

    const usuario = await UsuarioApp.findByPk(usuarioId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const buffer = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();

    if (usuario.imagen_url) {
      const oldKey = usuario.imagen_url.replace(
        `${process.env.CDN_BASE_URL}/`,
        ""
      );

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: oldKey
        })
      );
    }

    const key = `app-users/${usuario.id}/profile-${Date.now()}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable"
      })
    );

    const imagen_url = `${process.env.CDN_BASE_URL}/${key}`;

    await usuario.update({ imagen_url });

    res.json({
      success: true,
      imagen_url
    });
  } catch (error) {
    console.error("subirImagenUsuarioApp:", error);
    res.status(500).json({ message: "Error subiendo imagen" });
  }
};

exports.getEstablecimientosCercanos = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng required" });
    }

    const establecimientos = await Establecimiento.findAll({
      where: { activo: true }
    });

    const resultado = establecimientos
      .map(est => {
        const distancia = haversineDistance(
          Number(lat),
          Number(lng),
          Number(est.lat),
          Number(est.lng)
        );

        return {
          ...est.toJSON(),
          distancia
        };
      })
      .filter(est => est.distancia <= 5)
      .sort((a, b) => a.distancia - b.distancia);

    res.json(resultado);
  } catch (error) {
    console.error("getEstablecimientosCercanos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDetalleEstablecimiento = async (req, res) => {
  try {
    const { id } = req.params;

    const establecimiento = await Establecimiento.findOne({
      where: {
        id,
        activo: true
      },
      include: [
        {
          model: Carta,
          as: "cartas",
          where: { activa: true },
          required: false,
          attributes: ["id", "nombre", "orden"]
        }
      ],
      order: [["cartas", "orden", "ASC"]]
    });

    if (!establecimiento) {
      return res.status(404).json({
        message: "Establecimiento no encontrado"
      });
    }

    res.json(establecimiento);
  } catch (error) {
    console.error("getDetalleEstablecimiento:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDetalleEstablecimientoBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const establecimiento = await Establecimiento.findOne({
      where: {
        slug,
        activo: true
      },
      include: [
        {
          model: Carta,
          as: "cartas",
          where: { activa: true },
          required: false,
          attributes: ["id", "nombre", "orden"]
        }
      ],
      order: [["cartas", "orden", "ASC"]]
    });

    if (!establecimiento) {
      return res.status(404).json({
        message: "Establecimiento no encontrado"
      });
    }

    res.json(establecimiento);
  } catch (error) {
    console.error("getDetalleEstablecimientoBySlug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getCartaDetalle = async (req, res) => {
  try {
    const { id } = req.params;

    const carta = await Carta.findOne({
      where: {
        id,
        activa: true
      },
      attributes: ["id", "nombre"],
      include: [
        {
          model: Seccion,
          as: "secciones",
          required: false,
          attributes: ["id", "nombre", "orden"],
          include: [
            {
              model: Producto,
              as: "productos",
              required: false,
              attributes: [
                "id",
                "nombre",
                "precio",
                "descripcion",
                "imagen_url",
                "orden",
                "marca",
                "talla"
              ]
            }
          ]
        }
      ],
      order: [
        ["secciones", "orden", "ASC"],
        ["secciones", "productos", "orden", "ASC"]
      ]
    });

    if (!carta) {
      return res.status(404).json({
        message: "Carta no encontrada"
      });
    }

    res.json(carta);
  } catch (error) {
    console.error("getCartaDetalle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.redirectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const establecimiento = await Establecimiento.findOne({
      where: { slug, activo: true }
    });

    if (!establecimiento) {
      return res.status(404).send("Not found");
    }

    const playUrl =
      "https://play.google.com/store/apps/details" +
      "?id=com.hasaroo.nego" +
      `&referrer=slug%3D${encodeURIComponent(slug)}`;

    res.redirect(playUrl);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
