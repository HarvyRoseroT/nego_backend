const stripe = require("../config/stripe");

exports.createBillingPortalSession = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.stripe_customer_id) {
      return res.status(400).json({ message: "Stripe customer not found" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/billing`
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("BILLING PORTAL ERROR:", error);
    res.status(500).json({ message: "Billing portal error" });
  }
};
