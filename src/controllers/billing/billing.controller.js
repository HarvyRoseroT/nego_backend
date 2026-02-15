const axios = require("axios");
const { Subscription, Plan, Transaction } = require("../../models");
const crypto = require("crypto");

async function getAcceptanceToken(req, res) {
  try {
    const response = await axios.get(
      `${process.env.WOMPI_BASE_URL}/merchants/${process.env.WOMPI_PUBLIC_KEY}`
    );

    const token =
      response.data.data.presigned_acceptance.acceptance_token;

    return res.status(200).json({ acceptance_token: token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting acceptance token" });
  }
}

async function getMySubscription(req, res) {
  try {
    const userId = req.user.id;

    const subscription = await Subscription.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Plan,
          attributes: ["id", "name", "price", "interval", "currency"],
        },
      ],
    });

    return res.status(200).json(subscription || null);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching subscription" });
  }
}

async function createCheckoutData(req, res) {
  try {
    const user = req.user;
    const { plan_id } = req.body;

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (!process.env.WOMPI_INTEGRITY_SECRET) {
      return res.status(500).json({ message: "Integrity secret not configured" });
    }

    const reference = `PLAN-${user.id}-${plan.id}-${Date.now()}`;
    const amountInCents = plan.price;
    const currency = plan.currency;

    const stringToSign =
      reference +
      amountInCents +
      currency +
      process.env.WOMPI_INTEGRITY_SECRET;

    const signature = crypto
      .createHash("sha256")
      .update(stringToSign)
      .digest("hex");

    return res.status(200).json({
      reference,
      amountInCents,
      currency,
      signature
    });

  } catch (error) {
    console.log("CHECKOUT ERROR:", error);
    return res.status(500).json({
      message: "Checkout error",
      error: error.message
    });
  }
}


async function getMyInvoices(req, res) {
  try {
    const userId = req.user.id;

    const invoices = await Transaction.findAll({
      where: {
        user_id: userId,
        status: "APPROVED"
      },
      order: [["paid_at", "DESC"]],
      attributes: [
        "id",
        "reference",
        "amount",
        "currency",
        "status",
        "paid_at",
        "created_at"
      ]
    });

    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching invoices" });
  }
}

module.exports = {
  getAcceptanceToken,
  getMySubscription,
  createCheckoutData,
  getMyInvoices
};
