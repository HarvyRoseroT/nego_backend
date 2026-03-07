console.log("Subscription cron initialized");
const cron = require("node-cron");
const { Op } = require("sequelize");
const { Subscription, PaymentMethod, Transaction, User } = require("../models");
const wompiService = require("../controllers/billing/wompi.service");

cron.schedule("0 2 * * *", async () => {
  try {
    const now = new Date();

    const dueSubscriptions = await Subscription.findAll({
      where: {
        status: {
          [Op.in]: ["ACTIVE", "PAST_DUE"]
        },
        next_billing_date: {
          [Op.lte]: now
        }
      },
      include: [
        { model: PaymentMethod },
        { model: User }
      ]
    });

    for (const subscription of dueSubscriptions) {
      try {
        if (subscription.status === "FAILED") continue;

        const paymentMethod = subscription.PaymentMethod;
        if (!paymentMethod) continue;

        const reference = `RENEW-${subscription.id}-${Date.now()}`;

        const transactionResponse = await wompiService.createTransaction({
          amount: subscription.plan_price,
          currency: subscription.currency,
          customer_email: subscription.User.email,
          payment_source_id: paymentMethod.payment_source_id,
          reference,
          subscription_id: subscription.id
        });

        await Transaction.create({
          user_id: subscription.user_id,
          subscription_id: subscription.id,
          wompi_transaction_id: transactionResponse.id,
          reference,
          amount: subscription.plan_price,
          currency: subscription.currency,
          status: transactionResponse.status
        });

        subscription.status = "PAST_DUE";
        await subscription.save();

      } catch (error) {
        console.error("Cron renewal error:", error.message);
      }
    }

  } catch (error) {
    console.error("Subscription cron failed:", error.message);
  }
});
