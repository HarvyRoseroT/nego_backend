'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('superadmin', 'client'),
        defaultValue: 'client',
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      stripe_customer_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true
      },
      notification_preferences: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          emails_pagos: true,
          emails_cambios_plan: true,
          emails_novedades: false
        }
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

    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });

    await queryInterface.addIndex('users', ['stripe_customer_id'], {
      unique: true,
      name: 'users_stripe_customer_unique'
    });

    await queryInterface.addIndex('users', ['role'], {
      name: 'users_role_index'
    });

    await queryInterface.addIndex('users', ['isActive'], {
      name: 'users_isactive_index'
    });

    await queryInterface.addIndex('users', ['emailVerified'], {
      name: 'users_emailverified_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'users_stripe_customer_unique');
    await queryInterface.removeIndex('users', 'users_email_unique');
    await queryInterface.removeIndex('users', 'users_role_index');
    await queryInterface.removeIndex('users', 'users_isactive_index');
    await queryInterface.removeIndex('users', 'users_emailverified_index');

    await queryInterface.dropTable('users');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_users_role;'
    );
  }
};
