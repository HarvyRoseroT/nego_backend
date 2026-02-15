'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
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

      subscription_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'subscriptions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      wompi_transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      reference: {
        type: Sequelize.STRING,
        allowNull: false
      },

      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'COP'
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false
      },

      paid_at: {
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
    });

    await queryInterface.addIndex('transactions', ['user_id'], {
      name: 'transactions_user_id_index'
    });

    await queryInterface.addIndex('transactions', ['subscription_id'], {
      name: 'transactions_subscription_id_index'
    });

    await queryInterface.addIndex('transactions', ['wompi_transaction_id'], {
      unique: true,
      name: 'transactions_wompi_transaction_unique'
    });

    await queryInterface.addIndex('transactions', ['status'], {
      name: 'transactions_status_index'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('transactions');
  }
};
