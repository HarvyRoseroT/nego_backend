"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("productos", "marca", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("productos", "talla", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("productos", "color", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("productos", "sku", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("productos", "stock", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("productos", "tipo_producto", {
      type: Sequelize.ENUM("food", "clothing"),
      allowNull: false,
      defaultValue: "food",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("productos", "marca");
    await queryInterface.removeColumn("productos", "talla");
    await queryInterface.removeColumn("productos", "color");
    await queryInterface.removeColumn("productos", "sku");
    await queryInterface.removeColumn("productos", "stock");
    await queryInterface.removeColumn("productos", "tipo_producto");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_productos_tipo_producto";'
    );
  },
};