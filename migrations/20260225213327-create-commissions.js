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

      wompi_transaction_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      available_at: {
        type: Sequelize.DATE,
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

      payout_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addConstraint("commissions", {
      fields: ["referral_id", "payment_cycle_number"],
      type: "unique",
      name: "unique_referral_cycle_commission",
    });

    await queryInterface.addIndex("commissions", ["referral_id"]);
    await queryInterface.addIndex("commissions", ["status"]);
    await queryInterface.addIndex("commissions", ["available_at"]);
    await queryInterface.addIndex("commissions", ["payout_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("commissions");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_commissions_plan_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_commissions_status";'
    );
  },
};