'use strict';

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

      payment_method_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'payment_methods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      status: {
        type: Sequelize.ENUM(
          'TRIAL',
          'ACTIVE',
          'PAST_DUE',
          'FAILED',
          'EXPIRED',
          'CANCELED'
        ),
        allowNull: false,
        defaultValue: 'TRIAL'
      },

      plan_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'COP'
      },

      current_period_start: {
        type: Sequelize.DATE,
        allowNull: false
      },

      current_period_end: {
        type: Sequelize.DATE,
        allowNull: false
      },

      next_billing_date: {
        type: Sequelize.DATE,
        allowNull: false
      },

      retry_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      cancel_at_period_end: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    });

    await queryInterface.addIndex('subscriptions', ['user_id'], {
      name: 'subscriptions_user_id_index'
    });

    await queryInterface.addIndex('subscriptions', ['plan_id'], {
      name: 'subscriptions_plan_id_index'
    });

    await queryInterface.addIndex('subscriptions', ['status'], {
      name: 'subscriptions_status_index'
    });

    await queryInterface.addIndex('subscriptions', ['next_billing_date'], {
      name: 'subscriptions_next_billing_date_index'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subscriptions');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_subscriptions_status";'
    );
  }
};
