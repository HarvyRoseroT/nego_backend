"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("trading_alerts_history", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      pair: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timeframe: {
        type: Sequelize.STRING,
        allowNull: false
      },
      candle_timestamp: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      direction: {
        type: Sequelize.STRING,
        allowNull: false
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      signals_detected: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      price: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false
      },
      dedup_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
      }
    });

    await queryInterface.addIndex("trading_alerts_history", ["pair", "timeframe"], {
      name: "trading_alerts_history_pair_timeframe_idx"
    });
    await queryInterface.addIndex("trading_alerts_history", ["created_at"], {
      name: "trading_alerts_history_created_at_idx"
    });

    await queryInterface.createTable("trading_configs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      pair: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timeframe: {
        type: Sequelize.STRING,
        allowNull: false
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      swing_lookback: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
      }
    });

    await queryInterface.addIndex("trading_configs", ["pair", "timeframe"], {
      name: "trading_configs_pair_timeframe_unique",
      unique: true
    });

    const now = new Date();
    const pairs = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];
    const timeframes = ["4h", "1h", "15m"];
    const defaultConfigs = [];
    for (const pair of pairs) {
      for (const timeframe of timeframes) {
        defaultConfigs.push({
          pair,
          timeframe,
          enabled: true,
          swing_lookback: 5,
          created_at: now,
          updated_at: now
        });
      }
    }

    await queryInterface.bulkInsert("trading_configs", defaultConfigs);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("trading_configs");
    await queryInterface.dropTable("trading_alerts_history");
  }
};
