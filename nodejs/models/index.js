const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
console.log(`db config ${dbConfig.HOST} ${dbConfig.USER} ${dbConfig.PASSWORD} ${dbConfig.DB}`);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.order = require("./order.model.js")(sequelize, Sequelize);

module.exports = db;