const stripe = require("../config/stripe");
const { Subscription, User, Plan } = require("../models");
const {
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  sendRenewalEmail,
  sendCancellationEmail,
  sendCancellationScheduledEmail,
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

        if (!session.subscription || !session.metadata?.user_id) break;

        await Subscription.update(
          {
            stripe_subscription_id: session.subscription,
            status: "pending",
          },
          {
            where: { user_id: session.metadata.user_id },
          }
        );
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;

        let stripeSubscriptionId =
          invoice.subscription ||
          invoice.lines?.data?.[0]?.subscription;

        if (!stripeSubscriptionId) {
          const fullInvoice = await stripe.invoices.retrieve(invoice.id, {
            expand: ["subscription"],
          });
          stripeSubscriptionId = fullInvoice.subscription?.id;
        }

        if (!stripeSubscriptionId) break;

        const subscription = await Subscription.findOne({
          where: { stripe_subscription_id: stripeSubscriptionId },
          include: [{ model: User }],
        });

        if (!subscription) break;
        if (subscription.last_paid_invoice_id === invoice.id) break;

        const isFirstPayment =
          invoice.billing_reason === "subscription_create";

        subscription.status = "active";
        subscription.last_paid_invoice_id = invoice.id;

        if (isFirstPayment) {
          subscription.start_date = new Date();
          subscription.trial_end_date = null;
          subscription.end_date = null;
        }

        await subscription.save();

        if (isFirstPayment) {
          await sendPaymentSuccessEmail({
            to: subscription.User.email,
            amount: (invoice.amount_paid / 100).toFixed(2),
            currency: invoice.currency.toUpperCase(),
            invoiceUrl: invoice.hosted_invoice_url,
          });
        } else {
          await sendRenewalEmail({
            to: subscription.User.email,
            amount: (invoice.amount_paid / 100).toFixed(2),
            currency: invoice.currency.toUpperCase(),
            invoiceUrl: invoice.hosted_invoice_url,
          });
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;

        const stripeSubscriptionId =
          invoice.subscription ||
          invoice.lines?.data?.[0]?.subscription;

        if (!stripeSubscriptionId) break;

        const subscription = await Subscription.findOne({
          where: { stripe_subscription_id: stripeSubscriptionId },
          include: [{ model: User }],
        });

        if (!subscription) break;

        subscription.status = "past_due";
        await subscription.save();

        await sendPaymentFailedEmail({
          to: subscription.User.email,
        });

        break;
      }

      case "customer.subscription.updated": {
        const stripeSub = event.data.object;

        const subscription = await Subscription.findOne({
          where: { stripe_subscription_id: stripeSub.id },
          include: [{ model: User }],
        });

        if (!subscription) break;

        const priceId = stripeSub.items?.data?.[0]?.price?.id;

        if (priceId) {
          const plan = await Plan.findOne({
            where: { stripe_price_id: priceId },
          });

          if (plan && subscription.plan_id !== plan.id) {
            subscription.plan_id = plan.id;
          }
        }

        subscription.status = stripeSub.status === "active"
          ? "active"
          : subscription.status;

        subscription.start_date = new Date(
          stripeSub.current_period_start * 1000
        );

        subscription.end_date = stripeSub.cancel_at_period_end
          ? new Date(stripeSub.current_period_end * 1000)
          : null;

        await subscription.save();

        if (stripeSub.cancel_at_period_end) {
          await sendCancellationScheduledEmail({
            to: subscription.User.email,
            endDate: subscription.end_date,
          });
        }

        break;
      }


      case "customer.subscription.deleted": {
        const stripeSub = event.data.object;

        const subscription = await Subscription.findOne({
          where: { stripe_subscription_id: stripeSub.id },
          include: [{ model: User }],
        });

        if (!subscription) break;

        subscription.status = "canceled";
        subscription.end_date = new Date();
        await subscription.save();

        await sendCancellationEmail({
          to: subscription.User.email,
        });

        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).send("Webhook handler failed");
  }
};
