'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      stripe_price_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'COP'
      },
      interval: {
        type: Sequelize.ENUM('month', 'year'),
        allowNull: false
      },
      duration_days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('plans')
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_plans_interval";'
    )
  }
}
