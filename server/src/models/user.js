'use strict';
import 'dotenv/config'
import {DataTypes} from 'sequelize'
import {sequelize} from '../config/dbConnect.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Product from './product.js';

const User = sequelize.define('User', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  accessToken: DataTypes.STRING
}, {
  timestamps: true,
  freezeTableName: true
});

// Hash password before saving 
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// method to check password
User.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
User.prototype.generateAccessToken = function () {
  return jwt.sign(
    { id: this.id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
  );
};



  User.hasMany(Product, { foreignKey: "createdBy" });
  Product.belongsTo(User, { foreignKey: "createdBy" })


export default User


