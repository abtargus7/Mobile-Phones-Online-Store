'use strict';

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/dbConnect.js';


const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  productId: {
    type: DataTypes.UUID,
    references: {
      model: "Product",
      key: "id"
    },
  },
  variantTitle: {
    type: DataTypes.STRING
  },
  inventoryQuantity: {
    type: DataTypes.INTEGER
  },
  price: {
    type: DataTypes.STRING
  },
  comparePrice: {
    type: DataTypes.STRING
  },
  cost: {
    type: DataTypes.STRING
  },
  sku: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  freezeTableName: true
});


export default ProductVariant

