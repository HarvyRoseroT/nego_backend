'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('plans', [
      {
        name: 'Mensual',
        price: 29900,
        stripe_price_id: 'price_1SqnG6DZkz7sozFUZLQy9XZU',
        currency: 'COP',
        interval: 'month',
        duration_days: 30,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Anual',
        price: 299900,
        stripe_price_id: 'price_1SqnG6DZkz7sozFUBiPhrJvB',
        currency: 'COP',
        interval: 'year',
        duration_days: 365,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('plans', null, {})
  }
}
