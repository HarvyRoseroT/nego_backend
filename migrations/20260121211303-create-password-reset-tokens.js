"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("password_reset_tokens", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      usedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("password_reset_tokens");
  },
};
