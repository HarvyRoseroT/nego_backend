const stripe = require("../config/stripe");
const { Subscription, User } = require("../models");
const {
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail
} = require("../services/emailService");

module.exports = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await Subscription.findOne({
            where: { user_id: session.metadata.user_id }
          });

          if (subscription) {
            await subscription.update({
              stripe_subscription_id: session.subscription,
              status: "active",
              start_date: new Date(),
              trial_end_date: null,
              end_date: null
            });
          }
        }

        const user = await User.findOne({
          where: { stripe_customer_id: session.customer }
        });

        if (user && user.notification_preferences?.emails_pagos) {
          await sendPaymentSuccessEmail({
            to: user.email
          });
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;

        if (invoice.subscription) {
          await Subscription.update(
            { status: "past_due" },
            { where: { stripe_subscription_id: invoice.subscription } }
          );
        }

        const user = await User.findOne({
          where: { stripe_customer_id: invoice.customer }
        });

        if (user && user.notification_preferences?.emails_pagos) {
          await sendPaymentFailedEmail({
            to: user.email
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const stripeSub = event.data.object;

        await Subscription.update(
          {
            status: "canceled",
            end_date: new Date()
          },
          { where: { stripe_subscription_id: stripeSub.id } }
        );

        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("STRIPE WEBHOOK ERROR:", error);
    res.status(500).send("Webhook handler failed");
  }
};
