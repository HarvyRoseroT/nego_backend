const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AiSetting = sequelize.define(
  "AiSetting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    service_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    enabled: {
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
    tableName: "ai_settings",
    timestamps: true
  }
);

module.exports = AiSetting;
