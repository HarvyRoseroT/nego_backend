const { Subscription, Establecimiento } = require("../models");

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

    if (subscription.status === "trial") {
      if (subscription.trial_end_date && now <= subscription.trial_end_date) {
        return next();
      }
    }

    if (subscription.status === "active") {
      if (subscription.end_date && now <= subscription.end_date) {
        return next();
      }
    }

    if (subscription.status !== "expired") {
      await subscription.update({ status: "expired" });

      await Establecimiento.update(
        { activo: false },
        { where: { user_id: userId } }
      );
    }

    return res.status(402).json({
      message: "Subscription expired"
    });
  } catch (error) {
    console.error("SUBSCRIPTION MIDDLEWARE ERROR:", error);
    res.status(500).json({ message: "Subscription validation error" });
  }
};
