const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const user = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = user;
