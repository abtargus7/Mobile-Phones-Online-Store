'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaltValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      vendor: {
        type: Sequelize.STRING
      },
      isAvailabe: {
        type: Sequelize.BOOLEAN
      },
      tags: {
        type: Sequelize.JSON
      },
      status: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id"
        },
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
    await queryInterface.dropTable('product');
  }
};