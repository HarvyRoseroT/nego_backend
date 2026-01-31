const { Subscription } = require("../models");

const GRACE_PERIOD_DAYS = 5;

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription = await Subscription.findOne({
      where: { user_id: userId }
    });

    if (!subscription) {
      return res.status(403).json({ message: "No subscription found" });
    }

    const now = new Date();

    if (
      subscription.status === "trial" &&
      subscription.trial_end_date &&
      now <= subscription.trial_end_date
    ) {
      return next();
    }

    if (subscription.status === "active") {
      return next();
    }

    if (subscription.status === "past_due") {
      const graceLimit = new Date(subscription.updatedAt);
      graceLimit.setDate(graceLimit.getDate() + GRACE_PERIOD_DAYS);

      if (now <= graceLimit) {
        return next();
      }
    }

    return res.status(402).json({
      message: "Subscription inactive",
      status: subscription.status
    });
  } catch (error) {
    console.error("SUBSCRIPTION MIDDLEWARE ERROR:", error);
    res.status(500).json({ message: "Subscription validation error" });
  }
};
