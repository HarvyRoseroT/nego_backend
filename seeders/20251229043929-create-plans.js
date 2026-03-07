'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const plans = [
      {
        name: 'Mensual',
        price: 3990000,
        currency: 'COP',
        interval: 'month',
        duration_days: 30,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Anual',
        price: 39900000,
        currency: 'COP',
        interval: 'year',
        duration_days: 365,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      // {
      //   name: 'Test 1 Día',
      //   price: 150000, 
      //   currency: 'COP',
      //   interval: 'day',
      //   duration_days: 1,
      //   is_active: true,
      //   created_at: now,
      //   updated_at: now,
      // },
    ];

    for (const plan of plans) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO plans (
          name,
          price,
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
          :currency,
          :interval,
          :duration_days,
          :is_active,
          :created_at,
          :updated_at
        )
        ON CONFLICT (name)
        DO UPDATE SET
          price = EXCLUDED.price,
          duration_days = EXCLUDED.duration_days,
          interval = EXCLUDED.interval,
          is_active = EXCLUDED.is_active,
          updated_at = EXCLUDED.updated_at
        `,
        {
          replacements: plan,
          type: Sequelize.QueryTypes.INSERT,
        }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('plans', {
      name: ['Mensual', 'Anual', 'Test 1 Día']
    });
  },
};
