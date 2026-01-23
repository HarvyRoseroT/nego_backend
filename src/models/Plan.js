const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Plan extends Model {}

Plan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stripe_price_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "COP"
    },
    interval: {
      type: DataTypes.ENUM("month", "year"),
      allowNull: false
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: "Plan",
    tableName: "plans",
    underscored: true
  }
);

module.exports = Plan;
