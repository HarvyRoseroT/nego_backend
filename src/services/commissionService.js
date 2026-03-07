const { Referral, Commission } = require("../models");

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getCommissionPercentage(planType, paymentNumber) {
  if (planType === "yearly") {
    if (paymentNumber === 1) return 30;
    return null;
  }

  if (planType === "monthly") {
    if (paymentNumber === 1) return 40;
    if (paymentNumber === 2) return 20;
    if (paymentNumber === 3) return 20;
    return null;
  }

  return null;
}

async function processApprovedPayment({
  user,
  subscription,
  transaction,
  plan
}) {
  const referral = await Referral.findOne({
    where: { client_user_id: user.id }
  });

  if (!referral) return;

  const previousCount = await Commission.count({
    where: { referral_id: referral.id }
  });

  const paymentNumber = previousCount + 1;

  const planType = plan.duration_days === 365 ? "yearly" : "monthly";

  const percentage = getCommissionPercentage(planType, paymentNumber);

  if (!percentage) return;

  const commissionAmount = Math.floor(
    (transaction.amount / 100) * (percentage / 100)
  );

  try {
    await Commission.create({
      referral_id: referral.id,
      subscription_id: subscription.id,
      payment_cycle_number: paymentNumber,
      plan_type: planType,
      payment_amount: transaction.amount,
      commission_percentage: percentage,
      commission_amount: commissionAmount,
      wompi_transaction_id: transaction.wompi_transaction_id,
      available_at: addDays(new Date(), 7),
      status: "pending",
      payout_id: null,
      paid_at: null
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return;
    }
    throw error;
  }
}

module.exports = {
  processApprovedPayment
};