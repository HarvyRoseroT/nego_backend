const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Referral extends Model {}

Referral.init(
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

    client_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },

    trial_days_assigned: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Referral",
    tableName: "referrals",
    underscored: true
  }
);

module.exports = Referral;