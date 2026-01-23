const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already registered"
      },
      validate: {
        isEmail: {
          msg: "Invalid email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("superadmin", "client"),
      defaultValue: "client"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    notification_preferences: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        emails_pagos: true,
        emails_cambios_plan: true,
        emails_novedades: false
      }
    }
  },
  {
    tableName: "users",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] }
      }
    }
  }
)

User.prototype.updateLastLogin = async function () {
  this.lastLogin = new Date()
  await this.save()
}

module.exports = User
