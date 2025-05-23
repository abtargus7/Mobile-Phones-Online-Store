'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Product', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      vendor: {
        type: Sequelize.STRING
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      tags: {
        type: Sequelize.JSON
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "active"
      },
      category: {
        type: Sequelize.STRING
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "User",
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
    await queryInterface.dropTable('Product');
  }
};