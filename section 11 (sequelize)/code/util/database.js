const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "ibrahim26124", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
