const crypto = require("crypto");
const { Transaction, Subscription, User, Plan } = require("../../models");
const {
  sendPaymentSuccessEmail,
  sendRenewalEmail
} = require("../../services/emailService");

function validateSignature(rawBody, signature) {
  const computed = crypto
    .createHmac("sha256", process.env.WOMPI_EVENTS_SECRET)
    .update(rawBody)
    .digest("hex");

  return computed === signature;
}

async function handleWompiWebhook(req, res) {
  try {
    const signature =
      req.headers["x-event-signature"] ||
      req.headers["x-signature"];

    const rawBody = req.body;

    let parsedBody;

    if (Buffer.isBuffer(rawBody)) {
      parsedBody = JSON.parse(rawBody.toString());
    } else if (typeof rawBody === "string") {
      parsedBody = JSON.parse(rawBody);
    } else {
      parsedBody = rawBody;
    }

    if (process.env.WOMPI_ENV === "production") {
      if (!signature) {
        return res.status(400).json({ message: "Missing signature" });
      }

      const isValid = validateSignature(rawBody, signature);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid signature" });
      }
    }

    if (parsedBody.event !== "transaction.updated") {
      return res.status(200).json({ received: true });
    }

    const transactionData = parsedBody.data?.transaction;

    if (!transactionData?.reference) {
      return res.status(200).json({ received: true });
    }

    if (transactionData.status !== "APPROVED") {
      return res.status(200).json({ received: true });
    }

    const referenceParts = transactionData.reference.split("-");

    if (referenceParts.length < 3) {
      return res.status(200).json({ received: true });
    }

    const userId = referenceParts[1];
    const planId = referenceParts[2];

    const user = await User.findByPk(userId);
    const plan = await Plan.findByPk(planId);

    if (!user || !plan) {
      return res.status(200).json({ received: true });
    }

    const existingTransaction = await Transaction.findOne({
      where: { reference: transactionData.reference }
    });

    if (!existingTransaction) {
      await Transaction.create({
        user_id: user.id,
        subscription_id: null,
        reference: transactionData.reference,
        wompi_transaction_id: transactionData.id,
        amount: transactionData.amount_in_cents,
        currency: transactionData.currency,
        status: transactionData.status,
        paid_at: new Date()
      });
    }

    const now = new Date();
    const nextPeriod = new Date(
      now.getTime() + plan.duration_days * 24 * 60 * 60 * 1000
    );

    let subscription = await Subscription.findOne({
      where: { user_id: user.id }
    });

    const wasActive = subscription?.status === "ACTIVE";

    if (!subscription) {
      subscription = await Subscription.create({
        user_id: user.id,
        plan_id: plan.id,
        status: "ACTIVE",
        plan_price: plan.price,
        currency: plan.currency,
        current_period_start: now,
        current_period_end: nextPeriod,
        next_billing_date: nextPeriod,
        retry_count: 0
      });
    } else {
      subscription.plan_id = plan.id;
      subscription.status = "ACTIVE";
      subscription.plan_price = plan.price;
      subscription.currency = plan.currency;
      subscription.current_period_start = now;
      subscription.current_period_end = nextPeriod;
      subscription.next_billing_date = nextPeriod;
      subscription.retry_count = 0;
      await subscription.save();
    }

    const formattedAmount = (transactionData.amount_in_cents / 100).toLocaleString("es-CO", {
      style: "currency",
      currency: transactionData.currency,
      minimumFractionDigits: 0
    });

    const invoiceUrl = `${process.env.FRONTEND_URL}/facturas`;

    if (wasActive) {
      await sendRenewalEmail({
        to: user.email,
        amount: formattedAmount,
        currency: transactionData.currency,
        invoiceUrl
      });
    } else {
      await sendPaymentSuccessEmail({
        to: user.email,
        amount: formattedAmount,
        currency: transactionData.currency,
        invoiceUrl
      });
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.log("WEBHOOK ERROR:", error);
    return res.status(500).json({ message: "Webhook error" });
  }
}

module.exports = {
  handleWompiWebhook
};
