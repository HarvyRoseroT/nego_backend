'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos_mesa', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      plano_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'planos_establecimiento',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      mesa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'plano_elementos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuario_app_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios_app',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      mesa_nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      cliente_nombre: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cliente_telefono: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      notas: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM(
          'nuevo',
          'confirmado',
          'preparando',
          'listo',
          'entregado',
          'cancelado'
        ),
        allowNull: false,
        defaultValue: 'nuevo'
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
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

    await queryInterface.createTable('pedido_mesa_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      pedido_mesa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pedidos_mesa',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'productos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      nombre_producto: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      notas: {
        type: Sequelize.TEXT,
        allowNull: true
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

    await queryInterface.addIndex('pedidos_mesa', ['establecimiento_id']);
    await queryInterface.addIndex('pedidos_mesa', ['mesa_id']);
    await queryInterface.addIndex('pedidos_mesa', ['estado']);
    await queryInterface.addIndex('pedido_mesa_items', ['pedido_mesa_id']);
    await queryInterface.addIndex('pedido_mesa_items', ['producto_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pedido_mesa_items');
    await queryInterface.dropTable('pedidos_mesa');

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_pedidos_mesa_estado";'
      );
    }
  }
};
