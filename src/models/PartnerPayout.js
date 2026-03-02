const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class PartnerPayout extends Model {}

PartnerPayout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    total_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    commissions_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    period_start: {
      type: DataTypes.DATE,
      allowNull: false
    },

    period_end: {
      type: DataTypes.DATE,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("pending", "processing", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending"
    },

    paid_at: {
      type: DataTypes.DATE
    },

    transaction_reference: {
      type: DataTypes.STRING 
    }
  },
  {
    sequelize,
    modelName: "PartnerPayout",
    tableName: "partner_payouts",
    underscored: true
  }
);

module.exports = PartnerPayout;