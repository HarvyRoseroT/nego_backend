const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PlanoEstablecimiento = sequelize.define(
  "PlanoEstablecimiento",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    establecimiento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Plano principal"
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
    tableName: "planos_establecimiento",
    timestamps: true
  }
);

module.exports = PlanoEstablecimiento;
