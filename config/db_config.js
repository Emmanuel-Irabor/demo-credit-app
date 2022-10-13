const knex = require("knex")
const knexConfig = require("../knexfile")
require("dotenv").config();

<<<<<<< HEAD
const environment = process.env.DEV_ENV || process.env.NODE_ENV;
=======
const environment = process.env.DB_ENV || "production"
console.log(environment);
//const environment = process.env.DEV_ENV || process.env.NODE_ENV;
>>>>>>> 78e56271ad70c09806b0c1f258a1e0f17c2e2c25

module.exports = knex(knexConfig[environment])
