
const crypto = require("crypto");
const { Transaction, Subscription, User, Plan } = require("../../models");
const { sendPaymentSuccessEmail } = require("../../services/emailService");
const { processApprovedPayment } = require("../../services/commissionService");

function validateSignature(body, checksum) {
  const { data, timestamp } = body;

  if (!data?.transaction || !timestamp || !checksum) return false;

  const transaction = data.transaction;

  const stringToSign =
    transaction.id +
    transaction.status +
    transaction.amount_in_cents +
    timestamp +
    process.env.WOMPI_EVENTS_SECRET;

  const computed = crypto
    .createHash("sha256")
    .update(stringToSign)
    .digest("hex");

  return computed === checksum;
}

async function handleWompiWebhook(req, res) {
  try {
    const body = req.body;

    const headerChecksum =
      req.headers["x-event-checksum"] ||
      body.signature?.checksum;

    if (process.env.WOMPI_ENV === "production") {
      const isValid = validateSignature(body, headerChecksum);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid signature" });
      }
    }

    if (body.event !== "transaction.updated") {
      return res.status(200).json({ received: true });
    }

    const transactionData = body.data?.transaction;
    if (!transactionData) {
      return res.status(200).json({ received: true });
    }

    if (transactionData.status !== "APPROVED") {
      return res.status(200).json({ received: true });
    }

    if (!transactionData.reference) {
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

    if (transactionData.amount_in_cents !== plan.price) {
      return res.status(400).json({ message: "Amount mismatch" });
    }

    const existingTransaction = await Transaction.findOne({
      where: { wompi_transaction_id: transactionData.id }
    });

    if (existingTransaction) {
      return res.status(200).json({ received: true });
    }

    const now = new Date();
    const nextPeriod = new Date(
      now.getTime() + plan.duration_days * 24 * 60 * 60 * 1000
    );

    let subscription = await Subscription.findOne({
      where: { user_id: user.id }
    });

    if (!subscription) {
      subscription = await Subscription.create({
        user_id: user.id,
        plan_id: plan.id,
        status: "ACTIVE",
        plan_price: plan.price,
        currency: plan.currency,
        current_period_start: now,
        current_period_end: nextPeriod,
        retry_count: 0
      });
    } else {
      subscription.plan_id = plan.id;
      subscription.status = "ACTIVE";
      subscription.plan_price = plan.price;
      subscription.currency = plan.currency;
      subscription.current_period_start = now;
      subscription.current_period_end = nextPeriod;
      subscription.retry_count = 0;
      await subscription.save();
    }

    const transaction = await Transaction.create({
      user_id: user.id,
      subscription_id: subscription.id,
      reference: transactionData.reference,
      wompi_transaction_id: transactionData.id,
      amount: transactionData.amount_in_cents,
      currency: transactionData.currency,
      status: transactionData.status,
      paid_at: new Date(transactionData.finalized_at || now)
    });

    await processApprovedPayment({
      user,
      subscription,
      transaction,
      plan
    });

    const formattedAmount = (transactionData.amount_in_cents / 100).toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: transactionData.currency,
        minimumFractionDigits: 0
      }
    );

    const invoiceUrl = `${process.env.FRONTEND_URL}/facturas`;

    await sendPaymentSuccessEmail({
      to: user.email,
      amount: formattedAmount,
      currency: transactionData.currency,
      invoiceUrl
    });

    return res.status(200).json({ received: true });

  } catch (error) {
    console.log("WEBHOOK ERROR:", error);
    return res.status(500).json({ message: "Webhook error" });
  }
}

module.exports = {
  handleWompiWebhook
};