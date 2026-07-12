const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class BillingSetting extends Model {}

BillingSetting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    free_mode_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "BillingSetting",
    tableName: "billing_settings",
    underscored: true,
    timestamps: true
  }
);

module.exports = BillingSetting;
