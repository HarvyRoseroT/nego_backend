"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("commissions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      referral_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "referrals",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      subscription_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscriptions",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      payment_cycle_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      plan_type: {
        type: Sequelize.ENUM("monthly", "yearly"),
        allowNull: false,
      },

      payment_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      commission_percentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      commission_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "pending",
          "approved",
          "paid",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // índice antifraude webhook duplicado
    await queryInterface.addConstraint("commissions", {
      fields: ["subscription_id", "payment_cycle_number"],
      type: "unique",
      name: "unique_subscription_cycle_commission",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("commissions");
  },
};