const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define(
  "Transaction",
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

    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    wompi_transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },

    reference: {
      type: DataTypes.STRING,
      allowNull: false
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    currency: {
      type: DataTypes.STRING,
      defaultValue: "COP"
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false
    },

    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "transactions",
    timestamps: true,
    underscored: true
  }
);


module.exports = Transaction;
