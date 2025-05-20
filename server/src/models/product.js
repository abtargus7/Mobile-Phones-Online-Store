'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const product = sequelize.define('product', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaltValue: DataTypes.UUIDV4
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
    product.hasMany(models.productVariant, {foreignKey: "product"});
    models.productVariant.belongsTo(product, {foreignKey: "product"})
  };

  return product;
};
