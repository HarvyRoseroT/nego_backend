const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Subscription extends Model {}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    stripe_subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.ENUM(
        "trial",
        "pending",
        "active",
        "past_due",
        "expired",
        "canceled"
      ),
      defaultValue: "trial",
      allowNull: false
    },

    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trial_end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Subscription",
    tableName: "subscriptions",
    underscored: true
  }
);

module.exports = Subscription;
