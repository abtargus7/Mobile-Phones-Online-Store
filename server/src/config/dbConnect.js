import { Sequelize } from "sequelize";
import config from "./config.js";

const env = process.env.NODE_ENV || 'development'

const sequelize = new Sequelize(config[env])

const dbConnect = async() => {
    //check database connection
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}

export {dbConnect, sequelize}