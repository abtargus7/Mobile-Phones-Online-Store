'use strict';

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/dbConnect.js';

const ProductImage = sequelize.define('ProductImage', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  productId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: "Product",
      key: "id"
    }
  },
  image: {
    type: DataTypes.STRING
  },
  position: {
    type: DataTypes.INTEGER
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  freezeTableName: true
});


export default ProductImage
