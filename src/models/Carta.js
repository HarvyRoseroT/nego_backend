const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carta = sequelize.define(
  "Carta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    establecimiento_id: {           
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cartas",
    timestamps: true
  }
);

module.exports = Carta;
