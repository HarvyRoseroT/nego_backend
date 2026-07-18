"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      "trading_configs",
      { enabled: false, updated_at: new Date() },
      { pair: { [Sequelize.Op.ne]: "BTCUSDT" } }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      "trading_configs",
      { enabled: true, updated_at: new Date() },
      { pair: { [Sequelize.Op.ne]: "BTCUSDT" } }
    );
  }
};
