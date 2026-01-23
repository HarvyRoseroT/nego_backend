'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('secciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      orden: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      carta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cartas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('secciones', ['carta_id']);
    await queryInterface.addIndex('secciones', ['orden']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('secciones', 'secciones_carta_id');
    await queryInterface.removeIndex('secciones', 'secciones_orden');
    await queryInterface.dropTable('secciones');
  }
};