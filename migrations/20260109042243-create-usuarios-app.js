"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios_app", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isGuest: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lat: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      },
      lng: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      platform: {
        type: Sequelize.ENUM("android", "ios", "web"),
        allowNull: true
      },
      pushToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastAccess: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("usuarios_app");
  }
};
