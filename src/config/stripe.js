const Stripe = require("stripe");

let stripe = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
  console.log("✅ Stripe initialized");
} else {
  console.warn("⚠️ Stripe disabled: STRIPE_SECRET_KEY not set");
}

module.exports = stripe;
