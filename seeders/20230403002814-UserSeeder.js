"use strict";
var bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("mstusers", [
      {
        username: "admin",
        fullname: "Administrator",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("admin", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("mstusers", null, {});
  },
};
