const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

class TradingAlertHistory extends Model {}

TradingAlertHistory.init(
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
    candle_timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    direction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    signals_detected: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    price: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false
    },
    dedup_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: "TradingAlertHistory",
    tableName: "trading_alerts_history",
    underscored: true,
    timestamps: true
  }
);

module.exports = TradingAlertHistory;
