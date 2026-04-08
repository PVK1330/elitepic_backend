const { Sequelize } = require("sequelize");
const config = require("./config")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const connectDB = async () => {
  await sequelize.authenticate();
  return sequelize;
};

module.exports = { sequelize, connectDB };
