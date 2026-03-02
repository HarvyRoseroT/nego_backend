'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
    const name = process.env.SUPERADMIN_NAME || 'Super Admin';

    if (!email || !password) {
      throw new Error('SUPERADMIN_EMAIL y SUPERADMIN_PASSWORD son obligatorios');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await queryInterface.sequelize.query(
      `
      INSERT INTO "users" (
        "name",
        "email",
        "password",
        "role",
        "emailVerified",
        "emailVerifiedAt",
        "isActive",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        :name,
        :email,
        :password,
        'superadmin',
        true,
        :emailVerifiedAt,
        true,
        :createdAt,
        :updatedAt
      )
      ON CONFLICT ("email")
      DO UPDATE SET
        "role" = 'superadmin',
        "emailVerified" = true,
        "emailVerifiedAt" = EXCLUDED."emailVerifiedAt",
        "isActive" = true,
        "updatedAt" = EXCLUDED."updatedAt"
      `,
      {
        replacements: {
          name,
          email,
          password: hashedPassword,
          emailVerifiedAt: now,
          createdAt: now,
          updatedAt: now,
        },
        type: Sequelize.QueryTypes.INSERT,
      }
    );

    console.log('✅ Superadmin creado o actualizado correctamente');
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      role: 'superadmin',
    });
  },
};