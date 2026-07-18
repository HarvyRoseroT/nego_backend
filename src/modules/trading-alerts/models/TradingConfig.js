const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

class TradingConfig extends Model {}

TradingConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pair: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timeframe: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    swing_lookback: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    }
  },
  {
    sequelize,
    modelName: "TradingConfig",
    tableName: "trading_configs",
    underscored: true,
    timestamps: true
  }
);

module.exports = TradingConfig;
