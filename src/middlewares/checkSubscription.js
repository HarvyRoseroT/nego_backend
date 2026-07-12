const { Subscription, Establecimiento, User } = require("../models");
const { sendPlanExpiredEmail } = require("../services/emailService");
const { isFreeModeEnabled } = require("../services/billingMode.service");

const GRACE_PERIOD_DAYS = 0;

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (await isFreeModeEnabled()) {
      await enableEstablecimientos(userId);
      req.billingMode = {
        free_mode_enabled: true,
        payments_enabled: false
      };
      return next();
    }

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

    if (
      (subscription.status === "TRIAL" ||
        subscription.status === "ACTIVE") &&
      subscription.current_period_end &&
      now > subscription.current_period_end
    ) {
      subscription.status = "EXPIRED";

      if (!subscription.expiration_notified) {
        const user = await User.findByPk(userId);

        if (user?.email) {
          await sendPlanExpiredEmail({
            to: user.email,
          });
        }

        subscription.expiration_notified = true;
      }

      await subscription.save();
      await disableEstablecimientos(userId);

      return res.status(402).json({
        message: "Subscription expired",
        status: "EXPIRED",
      });
    }

    if (
      subscription.status === "ACTIVE" ||
      subscription.status === "TRIAL"
    ) {
      await enableEstablecimientos(userId);
      return next();
    }

    if (subscription.status === "PAST_DUE") {
      const graceLimit = new Date(subscription.updatedAt);
      graceLimit.setDate(
        graceLimit.getDate() + GRACE_PERIOD_DAYS
      );

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
