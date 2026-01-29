const stripe = require("../config/stripe");
const { Subscription, Plan } = require("../models");

exports.createSubscription = async (req, res) => {
  try {
    const { planId } = req.body;
    const user = req.user;

    if (!user || !user.stripe_customer_id) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const plan = await Plan.findByPk(planId);
    if (!plan || !plan.stripe_price_id) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripe_customer_id,
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url:
        "https://panel.nego.ink/billing/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "https://panel.nego.ink/billing/cancel",
    });

    await Subscription.update(
      {
        plan_id: plan.id,
        status: "pending",
      },
      {
        where: { user_id: user.id },
      }
    );

    return res.json({ url: session.url });
  } catch (error) {
    console.error("CREATE CHECKOUT ERROR:", error);
    return res.status(500).json({ message: "Stripe checkout error" });
  }
};
