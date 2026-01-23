const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmailVerificationToken = sequelize.define(
  "EmailVerificationToken",
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
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "used_at",
    },
  },
  {
    tableName: "email_verification_tokens",
    timestamps: true,
  }
);

module.exports = EmailVerificationToken;
