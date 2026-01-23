'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productos', {
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

      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },

      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      imagen_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      seccion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'secciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('productos', ['seccion_id'], {
      name: 'idx_productos_seccion_id'
    });

    await queryInterface.addIndex('productos', ['establecimiento_id'], {
      name: 'idx_productos_establecimiento_id'
    });

    await queryInterface.addIndex('productos', ['activo'], {
      name: 'idx_productos_activo'
    });

    await queryInterface.addIndex('productos', ['orden'], {
      name: 'idx_productos_orden'
    });

    await queryInterface.addIndex('productos', ['precio'], {
      name: 'idx_productos_precio'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('productos', 'idx_productos_seccion_id');
    await queryInterface.removeIndex('productos', 'idx_productos_establecimiento_id');
    await queryInterface.removeIndex('productos', 'idx_productos_activo');
    await queryInterface.removeIndex('productos', 'idx_productos_orden');
    await queryInterface.removeIndex('productos', 'idx_productos_precio');

    await queryInterface.dropTable('productos');
  }
};
