const axios = require("axios");

const WOMPI_BASE_URL = process.env.WOMPI_BASE_URL;

if (!WOMPI_BASE_URL) {
  throw new Error("WOMPI_BASE_URL is not defined in environment variables");
}

const headers = {
  Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
  "Content-Type": "application/json"
};

async function getMerchant() {
  const response = await axios.get(
    `${WOMPI_BASE_URL}/merchants/${process.env.WOMPI_PUBLIC_KEY}`
  );

  return response.data.data;
}

async function createTransaction({
  amount,
  currency,
  customer_email,
  payment_source_id,
  reference
}) {
  const response = await axios.post(
    `${WOMPI_BASE_URL}/transactions`,
    {
      amount_in_cents: amount,
      currency,
      customer_email,
      payment_source_id,
      reference
    },
    { headers }
  );

  return response.data.data;
}

module.exports = {
  getMerchant,
  createTransaction
};
