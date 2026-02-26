const { PartnerProfile } = require("../models");

function normalizeName(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid name for referral code");
  }

  return name
    .trim()
    .split(" ")[0]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

async function generateReferralCodeFromName(name, transaction) {
  const baseCode = normalizeName(name);

  let finalCode = baseCode;
  let counter = 1;
  let exists = true;

  while (exists) {
    const existing = await PartnerProfile.findOne({
      where: { referral_code: finalCode },
      transaction,
    });

    if (!existing) {
      exists = false;
    } else {
      finalCode = `${baseCode}${counter}`;
      counter++;
    }
  }

  return finalCode;
}

module.exports = { generateReferralCodeFromName };