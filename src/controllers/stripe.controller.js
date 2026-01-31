const stripe = require("../config/stripe");
const { Subscription, Plan } = require("../models");

exports.createSubscription = async (req, res) => {
  try {
    const { planId } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    if (!user.stripe_customer_id) {
      return res.status(400).json({ message: "Stripe customer not found" });
    }

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(400).json({ message: "Plan not found" });
    }

    if (!plan.stripe_price_id) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const subscription = await Subscription.findOne({
      where: { user_id: user.id }
    });

    if (!subscription) {
      return res.status(400).json({ message: "Subscription not found" });
    }

    await subscription.update({
      plan_id: plan.id,
      status: "pending"
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripe_customer_id,
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/billing/success`,
      cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,
      metadata: {
        user_id: user.id,
        plan_id: plan.id
      }
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("CREATE SUBSCRIPTION ERROR:", error);
    return res.status(500).json({ message: "Subscription error" });
  }
};
