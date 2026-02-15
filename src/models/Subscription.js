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

    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM(
        "TRIAL",
        "ACTIVE",
        "PAST_DUE",
        "FAILED",
        "EXPIRED",
        "CANCELED"
      ),
      defaultValue: "TRIAL",
      allowNull: false
    },

    plan_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    currency: {
      type: DataTypes.STRING,
      defaultValue: "COP"
    },

    current_period_start: {
      type: DataTypes.DATE,
      allowNull: false
    },

    current_period_end: {
      type: DataTypes.DATE,
      allowNull: false
    },

    next_billing_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    cancel_at_period_end: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  },
  {
    sequelize,
    modelName: "Subscription",
    tableName: "subscriptions",
    underscored: true,
    timestamps: true
  }
);

module.exports = Subscription;
