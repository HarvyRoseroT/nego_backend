const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PasswordResetToken = sequelize.define(
  "PasswordResetToken",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "password_reset_tokens",
    timestamps: true,
    indexes: [
      {
        fields: ["token"],
      },
      {
        fields: ["user_id"],
      },
    ],
  }
);

module.exports = PasswordResetToken;
