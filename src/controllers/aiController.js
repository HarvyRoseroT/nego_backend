const { generateTryOn } = require("../services/falService");

const tryOn = async (req, res) => {
  try {
    const { person_image, garment_image } = req.body;

    if (!person_image || !garment_image) {
      return res.status(400).json({
        error: "person_image and garment_image required",
      });
    }

    const imageUrl = await generateTryOn(person_image, garment_image);

    res.json({
      success: true,
      image: imageUrl,
    });

  } catch (error) {
    console.error("TryOn error:", error.body || error);

    if (error.statusCode === 503) {
      return res.status(503).json({
        error: "AI generation service is currently disabled"
      });
    }

    res.status(500).json({
        error: "AI generation failed"
    });
    }
};

module.exports = { tryOn };
