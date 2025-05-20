'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const productVariant = sequelize.define('productVariant', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaltValue: DataTypes.UUIDV4
    },
    product: {
      type: DataTypes.UUID,
      references: {
        model: "product",
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


  // Define associations here
  productVariant.associate = (models) => {
    // Example: User.hasMany(models.Order);
  };

  return productVariant;
};
