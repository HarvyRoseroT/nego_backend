'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('establecimientos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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

      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },

      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      direccion: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      pais: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      telefono_contacto: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      lat: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      lng: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      logo_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      imagen_ubicacion_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      domicilio_activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    await queryInterface.addIndex('establecimientos', ['user_id'], {
      name: 'idx_establecimientos_user_id'
    });

    await queryInterface.addIndex('establecimientos', ['slug'], {
      unique: true,
      name: 'idx_establecimientos_slug'
    });

    await queryInterface.addIndex('establecimientos', ['activo'], {
      name: 'idx_establecimientos_activo'
    });

    await queryInterface.addIndex('establecimientos', ['ciudad'], {
      name: 'idx_establecimientos_ciudad'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('establecimientos', 'idx_establecimientos_user_id');
    await queryInterface.removeIndex('establecimientos', 'idx_establecimientos_slug');
    await queryInterface.removeIndex('establecimientos', 'idx_establecimientos_activo');
    await queryInterface.removeIndex('establecimientos', 'idx_establecimientos_ciudad');
    await queryInterface.dropTable('establecimientos');
  }
};
