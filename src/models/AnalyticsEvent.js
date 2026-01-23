const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AnalyticsEvent = sequelize.define(
  "AnalyticsEvent",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    event_type: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },

    establecimiento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    carta_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    seccion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    device_id: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    origen: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },

    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    pais: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },

    ciudad: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
  },
  {
    tableName: "analytics_events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["establecimiento_id"] },
      { fields: ["event_type"] },
      { fields: ["created_at"] },
      { fields: ["device_id"] },
    ],
  }
);

module.exports = AnalyticsEvent;
