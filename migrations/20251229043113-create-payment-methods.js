'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_methods', {
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

      type: {
        type: Sequelize.ENUM('CARD'),
        allowNull: false,
        defaultValue: 'CARD'
      },

      payment_source_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      brand: {
        type: Sequelize.STRING,
        allowNull: true
      },

      last_four: {
        type: Sequelize.STRING(4),
        allowNull: true
      },

      is_default: {
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
    });

    await queryInterface.addIndex('payment_methods', ['user_id'], {
      name: 'payment_methods_user_id_index'
    });

    await queryInterface.addIndex('payment_methods', ['payment_source_id'], {
      unique: true,
      name: 'payment_methods_payment_source_unique'
    });

    await queryInterface.addIndex('payment_methods', ['is_default'], {
      name: 'payment_methods_is_default_index'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payment_methods');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payment_methods_type";'
    );
  }
};
