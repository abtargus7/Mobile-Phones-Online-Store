'use strict';

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/dbConnect.js';


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


  // Define associations here
  Product.associate = (models) => {
    //associate product with product variant
    models.Product.hasMany(models.ProductVariant, {foreignKey: "productId"});
    models.ProductVariant.belongsTo(models.Product, {foreignKey: "productId"})

    //associate product with product image
    models.Product.hasMany(models.ProductImage, {foreignKey: "productId"})
    models.ProductImage.belongsTo(models.Product, {foreignKey: "productId"})
  };

export default Product