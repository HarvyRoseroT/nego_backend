'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const plans = [
      {
        name: 'Mensual',
        price: 29900,
        stripe_price_id: 'price_1SqnG6DZkz7sozFUZLQy9XZU',
        currency: 'COP',
        interval: 'month',
        duration_days: 30,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Anual',
        price: 299900,
        stripe_price_id: 'price_1SqnG6DZkz7sozFUBiPhrJvB',
        currency: 'COP',
        interval: 'year',
        duration_days: 365,
        is_active: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const plan of plans) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO "plans" (
          name,
          price,
          stripe_price_id,
          currency,
          interval,
          duration_days,
          is_active,
          "createdAt",
          "updatedAt"
        )
        VALUES (
          :name,
          :price,
          :stripe_price_id,
          :currency,
          :interval,
          :duration_days,
          :is_active,
          :createdAt,
          :updatedAt
        )
        ON CONFLICT (stripe_price_id)
        DO NOTHING
        `,
        {
          replacements: plan,
          type: Sequelize.QueryTypes.INSERT,
        }
      );
    }
  },

  async down() {

    return Promise.resolve();
  },
};
