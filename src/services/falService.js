const { fal } = require("@fal-ai/client");
const { AiSetting } = require("../models");

const TRY_ON_SERVICE_NAME = "tryon";

fal.config({
  credentials: process.env.FAL_KEY
});

async function getAiServiceStatus() {
  const [status] = await AiSetting.findOrCreate({
    where: { service_name: TRY_ON_SERVICE_NAME },
    defaults: {
      service_name: TRY_ON_SERVICE_NAME,
      enabled: true
    }
  });

  return status;
}

async function isAiGenerationEnabled() {
  const status = await getAiServiceStatus();
  return status.enabled;
}

async function setAiServiceStatus(enabled, updatedBy = null) {
  const status = await getAiServiceStatus();

  await status.update({
    enabled,
    updated_by: updatedBy
  });

  return status;
}

async function generateTryOn(personImage, garmentImage) {
  const enabled = await isAiGenerationEnabled();

  if (!enabled) {
    const error = new Error("AI service disabled");
    error.statusCode = 503;
    throw error;
  }

  const result = await fal.subscribe("fal-ai/fashn/tryon/v1.6", {
    input: {
      model_image: personImage,
      garment_image: garmentImage
    }
  });

  return result.data.images[0].url;
}

module.exports = {
  generateTryOn,
  getAiServiceStatus,
  setAiServiceStatus,
  isAiGenerationEnabled
};
