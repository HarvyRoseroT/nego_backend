const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class CommissionPayout extends Model {}

CommissionPayout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    payout_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    commission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true 
    }
  },
  {
    sequelize,
    modelName: "CommissionPayout",
    tableName: "commission_payouts",
    underscored: true
  }
);

module.exports = CommissionPayout;