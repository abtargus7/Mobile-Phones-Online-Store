import { Sequelize } from "sequelize";
import config from "./config.js";

const env = process.env.NODE_ENV || 'development'

const sequelize = new Sequelize(config[env])

//function to check database connection
const dbConnect = async () => {
  
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

//function to sync database 
const syncDatabase = async () => {
  try {
    await sequelize.sync()
    console.log("Database Synced successfully")
  } catch (error) {
    console.log("Unable to sync database")
  }
}

export { dbConnect, sequelize, syncDatabase }