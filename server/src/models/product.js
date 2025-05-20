'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const product = sequelize.define('product', {
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
    isAvailabe: {
      type: DataTypes.BOOLEAN
    },
    tags: {
      type: DataTypes.JSON
    },
    status: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    createdBy: {
      type: DataTypes.UUID,
      references: {
        model: "user",
        key: "id"
      },
    }
  }, {
    timestamps: true,
    freezeTableName: true
  });


  // Define associations here
  product.associate = (models) => {
    //assosiate product with product variant
    models.product.hasMany(models.productVariant, {foreignKey: "productId"});
    models.productVariant.belongsTo(models.product, {foreignKey: "productId"})

    //assosiate product with product image
    models.product.hasMany(models.productImage, {foreignKey: "productId"})
    models.productImage.belongsTo(models.product, {foreignKey: "productId"})
  };

  return product;
};
