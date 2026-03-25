const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PedidoMesa = sequelize.define(
  "PedidoMesa",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    establecimiento_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plano_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mesa_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario_app_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mesa_nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cliente_nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cliente_telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM(
        "nuevo",
        "confirmado",
        "preparando",
        "listo",
        "entregado",
        "cancelado"
      ),
      allowNull: false,
      defaultValue: "nuevo"
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: "pedidos_mesa",
    timestamps: true
  }
);

module.exports = PedidoMesa;
