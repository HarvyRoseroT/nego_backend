"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("analytics_events", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      event_type: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },

      establecimiento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "establecimientos",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      carta_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      seccion_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      device_id: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },

      origen: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      ip: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },

      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      pais: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },

      ciudad: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("analytics_events", ["establecimiento_id"]);
    await queryInterface.addIndex("analytics_events", ["event_type"]);
    await queryInterface.addIndex("analytics_events", ["created_at"]);
    await queryInterface.addIndex("analytics_events", ["device_id"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("analytics_events");
  },
};
