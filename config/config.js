require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "mvp",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",

    timezone: "+00:00",

    dialectOptions: {
      useUTC: true,
    },
  },

  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "mvp_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",

    timezone: "+00:00",

    dialectOptions: {
      useUTC: true,
    },
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",

    timezone: "+00:00",

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      useUTC: true,
    },
  },
};
