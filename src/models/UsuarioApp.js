const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UsuarioApp = sequelize.define(
  "UsuarioApp",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isGuest: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    platform: {
      type: DataTypes.ENUM("android", "ios", "web"),
      allowNull: true
    },
    pushToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastAccess: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: "usuarios_app",
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
);

UsuarioApp.prototype.updateLastAccess = async function () {
  this.lastAccess = new Date();
  await this.save();
};

module.exports = UsuarioApp;
