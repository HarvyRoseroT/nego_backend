const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PedidoMesaItem = sequelize.define(
  "PedidoMesaItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pedido_mesa_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_producto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "pedido_mesa_items",
    timestamps: true
  }
);

module.exports = PedidoMesaItem;
