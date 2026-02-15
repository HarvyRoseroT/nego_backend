const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PaymentMethod = sequelize.define(
  "PaymentMethod",
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

    type: {
      type: DataTypes.ENUM("CARD"),
      defaultValue: "CARD"
    },

    payment_source_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },

    last_four: {
      type: DataTypes.STRING(4),
      allowNull: true
    },

    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "payment_methods",
    timestamps: true,
    underscored: true
  }
);

module.exports = PaymentMethod;
