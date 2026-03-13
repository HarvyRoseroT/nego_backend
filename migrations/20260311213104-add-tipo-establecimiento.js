"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("establecimientos", "tipo_establecimiento", {
      type: Sequelize.ENUM(
        "restaurant",
        "cafe",
        "dark_kitchen",
        "bar",
        "clothing_store"
      ),
      allowNull: false,
      defaultValue: "restaurant"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "establecimientos",
      "tipo_establecimiento"
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_establecimientos_tipo_establecimiento";'
    );
  }
};