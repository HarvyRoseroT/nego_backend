const { Subscription, Establecimiento } = require("../models");

const GRACE_PERIOD_DAYS = 5;

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription = await Subscription.findOne({
      where: { user_id: userId },
    });

    if (!subscription) {
      await disableEstablecimientos(userId);
      return res.status(403).json({
        message: "No subscription found",
      });
    }

    const now = new Date();

    if (subscription.status === "TRIAL") {
      if (subscription.current_period_end && now > subscription.current_period_end) {
        subscription.status = "EXPIRED";
        await subscription.save();
        await disableEstablecimientos(userId);
        return res.status(402).json({
          message: "Trial expired",
          status: "EXPIRED",
        });
      }

      await enableEstablecimientos(userId);
      return next();
    }

    if (subscription.status === "ACTIVE") {
      if (
        subscription.current_period_end &&
        now > subscription.current_period_end
      ) {
        subscription.status = "EXPIRED";
        await subscription.save();
        await disableEstablecimientos(userId);
        return res.status(402).json({
          message: "Subscription expired",
          status: "EXPIRED",
        });
      }

      await enableEstablecimientos(userId);
      return next();
    }

    if (subscription.status === "PAST_DUE") {
      const graceLimit = new Date(subscription.updatedAt);
      graceLimit.setDate(graceLimit.getDate() + GRACE_PERIOD_DAYS);

      if (now <= graceLimit) {
        await enableEstablecimientos(userId);
        return next();
      }

      subscription.status = "FAILED";
      await subscription.save();
      await disableEstablecimientos(userId);

      return res.status(402).json({
        message: "Payment grace period expired",
        status: "FAILED",
      });
    }

    await disableEstablecimientos(userId);

    return res.status(402).json({
      message: "Subscription inactive",
      status: subscription.status,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Subscription validation error",
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
