const sharp = require("sharp");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const { Establecimiento } = require("../models");

exports.subirLogo = async (req, res) => {
  try {
    const establecimientoId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No se envió imagen" });
    }

    const establecimiento = await Establecimiento.findOne({
      where: {
        id: establecimientoId,
        user_id: req.user.id,
      },
    });

    if (!establecimiento) {
      return res.status(404).json({ message: "Not found" });
    }

    if (establecimiento.logo_url) {
      const oldKey = establecimiento.logo_url.replace(
        `${process.env.CDN_BASE_URL}/`,
        ""
      );

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: oldKey,
        })
      );
    }

    const buffer = await sharp(req.file.buffer)
      .resize(512, 512, { fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();

    const key = `est/${establecimiento.id}/logo-${Date.now()}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000",
      })
    );

    const logo_url = `${process.env.CDN_BASE_URL}/${key}`;

    await establecimiento.update({ logo_url });

    res.json({ success: true, logo_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload logo error" });
  }
};

exports.borrarLogo = async (req, res) => {
  try {
    const establecimientoId = req.params.id;

    const establecimiento = await Establecimiento.findOne({
      where: {
        id: establecimientoId,
        user_id: req.user.id,
      },
    });

    if (!establecimiento || !establecimiento.logo_url) {
      return res.status(404).json({ message: "Not found" });
    }

    const key = establecimiento.logo_url.replace(
      `${process.env.CDN_BASE_URL}/`,
      ""
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );

    await establecimiento.update({ logo_url: null });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete logo error" });
  }
};

exports.subirImagenUbicacion = async (req, res) => {
  try {
    const establecimientoId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No se envió imagen" });
    }

    const establecimiento = await Establecimiento.findOne({
      where: {
        id: establecimientoId,
        user_id: req.user.id,
      },
    });

    if (!establecimiento) {
      return res.status(404).json({ message: "Not found" });
    }

    if (establecimiento.imagen_ubicacion_url) {
      const oldKey = establecimiento.imagen_ubicacion_url.replace(
        `${process.env.CDN_BASE_URL}/`,
        ""
      );

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: oldKey,
        })
      );
    }

    const buffer = await sharp(req.file.buffer)
      .resize(1200, 800, { fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();

    const key = `est/${establecimiento.id}/ubicacion-${Date.now()}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000",
      })
    );

    const imagen_ubicacion_url = `${process.env.CDN_BASE_URL}/${key}`;

    await establecimiento.update({ imagen_ubicacion_url });

    res.json({ success: true, imagen_ubicacion_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload image error" });
  }
};

exports.borrarImagenUbicacion = async (req, res) => {
  try {
    const establecimientoId = req.params.id;

    const establecimiento = await Establecimiento.findOne({
      where: {
        id: establecimientoId,
        user_id: req.user.id,
      },
    });

    if (!establecimiento || !establecimiento.imagen_ubicacion_url) {
      return res.status(404).json({ message: "Not found" });
    }

    const key = establecimiento.imagen_ubicacion_url.replace(
      `${process.env.CDN_BASE_URL}/`,
      ""
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );

    await establecimiento.update({ imagen_ubicacion_url: null });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete image error" });
  }
};
