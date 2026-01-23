'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'plans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      stripe_subscription_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      status: {
        type: Sequelize.ENUM(
          'trial',
          'pending',
          'active',
          'past_due',
          'expired',
          'canceled'
        ),
        allowNull: false,
        defaultValue: 'trial'
      },

      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },

      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },

      trial_end_date: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('subscriptions')

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_subscriptions_status";'
    )
  }
}
