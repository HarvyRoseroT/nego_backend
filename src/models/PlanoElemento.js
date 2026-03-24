const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PlanoElemento = sequelize.define(
  "PlanoElemento",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    plano_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM("mesa", "objeto_cuadrado"),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    posicion_x: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    posicion_y: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    ancho: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    alto: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    tableName: "plano_elementos",
    timestamps: true
  }
);

module.exports = PlanoElemento;
