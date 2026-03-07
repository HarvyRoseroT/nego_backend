const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Commission extends Model {}

Commission.init(
{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  referral_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  subscription_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  payment_cycle_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  plan_type: {
    type: DataTypes.ENUM("monthly", "yearly"),
    allowNull: false
  },

  payment_amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  commission_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  commission_amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  wompi_transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  available_at: {
    type: DataTypes.DATE,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "pending",
      "approved",
      "paid",
      "cancelled"
    ),
    allowNull: false,
    defaultValue: "pending"
  },

  payout_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  }

},
{
  sequelize,
  modelName: "Commission",
  tableName: "commissions",
  underscored: true,

  indexes: [
    {
      unique: true,
      fields: ["referral_id", "payment_cycle_number"]
    },

    {
      fields: ["referral_id"]
    },

    {
      fields: ["status"]
    },

    {
      fields: ["available_at"]
    },

    {
      fields: ["payout_id"]
    }
  ]
}
);

module.exports = Commission;