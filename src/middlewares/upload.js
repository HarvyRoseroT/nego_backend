const path = require("path");
const multer = require("multer");

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "application/octet-stream"
]);

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".jfif",
  ".png",
  ".webp"
]);

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024 
  },

  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const hasAllowedMimeType = allowedMimeTypes.has(file.mimetype);
    const hasAllowedExtension = allowedExtensions.has(extension);
    const isGenericMimeType = file.mimetype === "application/octet-stream";

    if (!hasAllowedMimeType && !hasAllowedExtension) {
      const error = new Error("Formato de imagen no permitido");
      error.statusCode = 400;
      return cb(error);
    }

    if (isGenericMimeType && !hasAllowedExtension) {
      const error = new Error("Formato de imagen no permitido");
      error.statusCode = 400;
      return cb(error);
    }

    cb(null, true);
  }
});

module.exports = upload;
