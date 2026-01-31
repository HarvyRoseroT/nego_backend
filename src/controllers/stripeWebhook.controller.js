const stripe = require("../config/stripe");
const { Subscription } = require("../models");

module.exports = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  console.log("🔔 Webhook recibido");

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Error verificando firma:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("📌 Evento:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("✅ checkout.session.completed");
        console.log("   session.id:", session.id);
        console.log("   session.subscription:", session.subscription);
        console.log("   metadata:", session.metadata);

        if (!session.subscription || !session.metadata?.user_id) break;

        await Subscription.update(
          {
            stripe_subscription_id: session.subscription,
            status: "pending"
          },
          {
            where: {
              user_id: session.metadata.user_id
            }
          }
        );

        console.log("🟡 stripe_subscription_id guardado");
        break;
      }

      case "invoice.paid": {
        let invoice = event.data.object;

        console.log("💰 invoice.paid");
        console.log("   invoice.id:", invoice.id);

        let stripeSubscriptionId =
          invoice.subscription ||
          invoice.lines?.data?.[0]?.subscription;

        // 🔁 fallback oficial recomendado por Stripe
        if (!stripeSubscriptionId) {
          console.log("🔁 Recuperando invoice desde Stripe...");
          const fullInvoice = await stripe.invoices.retrieve(invoice.id, {
            expand: ["subscription"]
          });
          stripeSubscriptionId = fullInvoice.subscription?.id;
        }

        console.log("   stripeSubscriptionId:", stripeSubscriptionId);

        if (!stripeSubscriptionId) {
          console.error("❌ No se pudo obtener stripe_subscription_id");
          break;
        }

        const updated = await Subscription.update(
          {
            status: "active",
            start_date: new Date(),
            trial_end_date: null,
            end_date: null
          },
          {
            where: {
              stripe_subscription_id: stripeSubscriptionId
            }
          }
        );

        console.log("🟢 Subscription activada:", updated);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;

        const stripeSubscriptionId =
          invoice.subscription ||
          invoice.lines?.data?.[0]?.subscription;

        if (!stripeSubscriptionId) break;

        await Subscription.update(
          { status: "past_due" },
          { where: { stripe_subscription_id: stripeSubscriptionId } }
        );

        console.log("🟠 Subscription marcada como past_due");
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSub = event.data.object;

        console.log("🗑️ customer.subscription.deleted");
        console.log("   stripe_subscription_id:", stripeSub.id);

        await Subscription.update(
          {
            status: "canceled",
            end_date: new Date()
          },
          { where: { stripe_subscription_id: stripeSub.id } }
        );

        console.log("🔴 Subscription cancelada");
        break;
      }

      default:
        console.log("ℹ️ Evento ignorado:", event.type);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error("🔥 ERROR EN WEBHOOK:");
    console.error(error);
    res.status(500).send("Webhook handler failed");
  }
};
