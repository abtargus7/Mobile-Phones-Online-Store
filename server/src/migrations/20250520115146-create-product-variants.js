'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productVariants', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaltValue: Sequelize.UUIDV4
      },
      product: {
        type: Sequelize.STRING
      },
      variantTitle: {
        type: Sequelize.STRING
      },
      inventoryQuantity: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.STRING
      },
      comparePrice: {
        type: Sequelize.STRING
      },
      cost: {
        type: Sequelize.STRING
      },
      sku: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('productVariants');
  }
};