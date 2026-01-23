"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("cartas", "orden", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.sequelize.query(`
      UPDATE cartas
      SET orden = sub.rn - 1
      FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                 PARTITION BY establecimiento_id
                 ORDER BY "createdAt" ASC
               ) AS rn
        FROM cartas
      ) AS sub
      WHERE cartas.id = sub.id
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("cartas", "orden");
  }
};
