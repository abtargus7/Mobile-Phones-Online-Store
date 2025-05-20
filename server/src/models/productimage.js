'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const productImage = sequelize.define('productImage', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    productId: {
      type: DataTypes.UUID,
      references: {
        model: "product",
        key: "id"
      },
      image: {
        type: DataTypes.STRING
      },
      postition: {
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
    }
  }, {
    timestamps: true,
    freezeTableName: true
  });


  // Define associations here
  productImage.associate = (models) => {
    // Example: User.hasMany(models.Order);
  };

  return productImage;
};
