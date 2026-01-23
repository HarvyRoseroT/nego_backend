const stripe = require("../config/stripe");
const { Subscription, Plan } = require("../models");

exports.createSubscription = async (req, res) => {
  try {
    const { planId } = req.body;
    const user = req.user;


    if (!user) {
      console.log("ERROR: USER NOT PRESENT (AUTH)");
      return res.status(400).json({ message: "User not authenticated" });
    }

    if (!user.stripe_customer_id) {
      console.log("ERROR: STRIPE CUSTOMER ID MISSING");
      return res.status(400).json({ message: "Stripe customer not found" });
    }

    const plan = await Plan.findByPk(planId);


    if (!plan) {
      return res.status(400).json({ message: "Plan not found" });
    }

    if (!plan.stripe_price_id) {
      return res.status(400).json({ message: "Invalid plan (no stripe price)" });
    }

    const subscription = await Subscription.findOne({
      where: { user_id: user.id }
    });



    if (!subscription) {
      return res.status(400).json({ message: "Subscription not found" });
    }

    const stripeSubscription = await stripe.subscriptions.create({
      customer: user.stripe_customer_id,
      items: [{ price: plan.stripe_price_id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription"
      },
      expand: ["latest_invoice.payment_intent"]
    });


    subscription.plan_id = plan.id;
    subscription.stripe_subscription_id = stripeSubscription.id;
    subscription.status = "pending";
    subscription.start_date = new Date();
    subscription.trial_end_date = null;

    await subscription.save();


    return res.json({
      clientSecret:
        stripeSubscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error("CREATE SUBSCRIPTION FATAL ERROR:", error);
    return res.status(500).json({ message: "Subscription error" });
  }
};
