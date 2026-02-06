const { Subscription, Establecimiento } = require("../models");

const GRACE_PERIOD_DAYS = 5;

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription = await Subscription.findOne({
      where: { user_id: userId }
    });

    if (!subscription) {
      await disableEstablecimientos(userId);
      return res.status(403).json({ message: "No subscription found" });
    }

    const now = new Date();

    if (
      subscription.status === "trial" &&
      subscription.trial_end_date &&
      now > subscription.trial_end_date
    ) {
      subscription.status = "expired";
      subscription.end_date = now;
      await subscription.save();
      await disableEstablecimientos(userId);
      return res.status(402).json({
        message: "Trial expired",
        status: "expired"
      });
    }

    if (
      subscription.status === "trial" &&
      subscription.trial_end_date &&
      now <= subscription.trial_end_date
    ) {
      await enableEstablecimientos(userId);
      return next();
    }

    if (subscription.status === "active") {
      await enableEstablecimientos(userId);
      return next();
    }

    if (subscription.status === "past_due") {
      const graceLimit = new Date(subscription.updatedAt);
      graceLimit.setDate(graceLimit.getDate() + GRACE_PERIOD_DAYS);

      if (now <= graceLimit) {
        await enableEstablecimientos(userId);
        return next();
      }
    }

    await disableEstablecimientos(userId);

    return res.status(402).json({
      message: "Subscription inactive",
      status: subscription.status
    });
  } catch (error) {
    return res.status(500).json({
      message: "Subscription validation error"
    });
  }
};

async function disableEstablecimientos(userId) {
  await Establecimiento.update(
    { activo: false },
    { where: { user_id: userId } }
  );
}

async function enableEstablecimientos(userId) {
  await Establecimiento.update(
    { activo: true },
    { where: { user_id: userId } }
  );
}
