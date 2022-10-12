require("dotenv").config();
const mysql = require('mysql2')

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQL_DEV_HOST,
      user: process.env.MYSQL_DEV_USER,
      port: process.env.MYSQL_DEV_PORT,
      password: process.env.MYSQL_DEV_PASSWORD,
      database: process.env.MYSQL_DEV_DATABASE
    },
    migrations: {
      directory: "./database"
    },
    seeds: {
      directory: "./database/seeds"
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: __dirname + "/database"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    }
  },
};
