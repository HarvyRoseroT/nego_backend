const stripe = require("../config/stripe");
const { Subscription, Plan, User } = require("../models");
const {
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  sendPlanChangeEmail
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

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;

        if (invoice.subscription) {
          const subscription = await Subscription.findOne({
            where: { stripe_subscription_id: invoice.subscription }
          });

          if (subscription) {
            const plan = await Plan.findByPk(subscription.plan_id);

            const startDate = new Date();
            const endDate = new Date(startDate);

            if (plan?.duration_days) {
              endDate.setDate(startDate.getDate() + plan.duration_days);
            }

            subscription.status = "active";
            subscription.start_date = startDate;
            subscription.end_date = endDate;
            subscription.trial_end_date = null;

            await subscription.save();
          }
        }

        const user = await User.findOne({
          where: { stripe_customer_id: invoice.customer }
        });

        if (user && user.notification_preferences?.emails_pagos) {
          await sendPaymentSuccessEmail({
            to: user.email,
            amount: (invoice.amount_paid / 100).toLocaleString("es-CO"),
            currency: invoice.currency.toUpperCase(),
            invoiceUrl: invoice.hosted_invoice_url
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

        if (
          user &&
          user.notification_preferences?.emails_pagos
        ) {
          await sendPaymentFailedEmail({
            to: user.email
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const stripeSub = event.data.object;

        await Subscription.update(
          { status: "canceled", end_date: new Date() },
          { where: { stripe_subscription_id: stripeSub.id } }
        );

        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).send("Webhook handler failed");
  }
};
