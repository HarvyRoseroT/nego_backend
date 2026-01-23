const sharp = require("sharp");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const { Producto } = require("../models");

exports.subirImagenProducto = async (req, res) => {
  try {
    const productoId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No se envió imagen" });
    }

    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const buffer = await sharp(req.file.buffer)
      .resize(800, 800, { fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();

    const key = `est/${producto.establecimiento_id}/prod/${producto.id}.webp`;

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

    await producto.update({ imagen_url });

    res.json({
      success: true,
      imagen_url
    });
  } catch (error) {
    console.error("UPLOAD IMAGE ERROR:", error);
    res.status(500).json({ message: "Error subiendo imagen" });
  }
};

exports.borrarImagenProducto = async (req, res) => {
  try {
    const productoId = req.params.id;

    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (!producto.imagen_url) {
      return res.status(400).json({ message: "El producto no tiene imagen" });
    }

    const key = producto.imagen_url.replace(
      `${process.env.CDN_BASE_URL}/`,
      ""
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      })
    );

    await producto.update({ imagen_url: null });

    res.json({
      success: true,
      message: "Imagen eliminada correctamente"
    });
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);
    res.status(500).json({ message: "Error eliminando imagen" });
  }
};
