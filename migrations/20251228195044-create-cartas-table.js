'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cartas', {
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
      activa: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      establecimiento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'establecimientos',
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

    await queryInterface.addIndex('cartas', ['establecimiento_id']);
    await queryInterface.addIndex('cartas', ['activa']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('cartas', 'cartas_establecimiento_id');
    await queryInterface.removeIndex('cartas', 'cartas_activa');
    await queryInterface.dropTable('cartas');
  }
};