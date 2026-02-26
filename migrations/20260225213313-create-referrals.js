"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("referrals", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      partner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "partner_profiles",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      client_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      trial_days_assigned: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("referrals");
  },
};