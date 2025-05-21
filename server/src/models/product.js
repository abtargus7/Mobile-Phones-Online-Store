'use strict';

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/dbConnect.js';
import ProductImage from './productimage.js';
import ProductVariant from './productvariants.js';


const Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    vendor: {
      type: DataTypes.STRING
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tags: {
      type: DataTypes.JSON
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active"
    },
    category: {
      type: DataTypes.STRING
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id"
      }
    }
  }, {
    timestamps: true,
    freezeTableName: true
  });


// associations
 
    //associate product with product variant
    Product.hasMany(ProductVariant, {foreignKey: "productId"});
    ProductVariant.belongsTo(Product, {foreignKey: "productId"})

    //associate product with product image
    Product.hasMany(ProductImage, {foreignKey: "productId"})
    ProductImage.belongsTo(Product, {foreignKey: "productId"})



export default Product