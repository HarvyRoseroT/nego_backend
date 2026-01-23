const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    imagen_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    seccion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    establecimiento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "productos",
    timestamps: true,
  }
);

module.exports = Producto;
