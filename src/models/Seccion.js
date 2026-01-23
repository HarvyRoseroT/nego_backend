const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Seccion = sequelize.define(
  "Seccion",
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
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: "secciones",
    timestamps: true
  }
);

module.exports = Seccion;
