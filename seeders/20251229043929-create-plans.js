'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const plans = [
      {
        name: 'Mensual',
        price: 2990000, 
        stripe_price_id: 'price_1SqnG6DZkz7sozFUZLQy9XZU',
        currency: 'COP',
        interval: 'month',
        duration_days: 30,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      
    ];

    for (const plan of plans) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO plans (
          name,
          price,
          stripe_price_id,
          currency,
          interval,
          duration_days,
          is_active,
          created_at,
          updated_at
        )
        VALUES (
          :name,
          :price,
          :stripe_price_id,
          :currency,
          :interval,
          :duration_days,
          :is_active,
          :created_at,
          :updated_at
        )
        ON CONFLICT (stripe_price_id)
        DO UPDATE SET
          price = EXCLUDED.price,
          updated_at = EXCLUDED.updated_at
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
