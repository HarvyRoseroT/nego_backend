"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("email_verification_tokens", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      expires_at: {
        type: Sequelize.DATE, 
        allowNull: false,
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE email_verification_tokens
      ALTER COLUMN expires_at
      TYPE TIMESTAMP WITH TIME ZONE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE email_verification_tokens
      ALTER COLUMN used_at
      TYPE TIMESTAMP WITH TIME ZONE;
    `);

    await queryInterface.addIndex("email_verification_tokens", ["token"], {
      unique: true,
      name: "email_verification_tokens_token_unique",
    });

    await queryInterface.addIndex(
      "email_verification_tokens",
      ["user_id"],
      {
        name: "email_verification_tokens_user_id_index",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("email_verification_tokens");
  },
};
