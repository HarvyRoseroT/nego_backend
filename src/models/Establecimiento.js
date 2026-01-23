const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Establecimiento = sequelize.define(
  "Establecimiento",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },

    descripcion: {
      type: DataTypes.TEXT
    },

    direccion: {
      type: DataTypes.STRING
    },

    ciudad: {
      type: DataTypes.STRING
    },

    pais: {
      type: DataTypes.STRING,
      allowNull: false
    },

    telefono_contacto: {
      type: DataTypes.STRING,
      allowNull: true
    },

    lat: {
      type: DataTypes.FLOAT
    },

    lng: {
      type: DataTypes.FLOAT
    },

    logo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    imagen_ubicacion_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    domicilio_activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "establecimientos",
    timestamps: true
  }
);

module.exports = Establecimiento;
