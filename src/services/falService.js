const { fal } = require("@fal-ai/client");

fal.config({
  credentials: process.env.FAL_KEY
});

async function generateTryOn(personImage, garmentImage) {

  const result = await fal.subscribe("fal-ai/fashn/tryon/v1.6", {
    input: {
      model_image: personImage,
      garment_image: garmentImage
    }
  });

  return result.data.images[0].url;
}

module.exports = { generateTryOn };