"use strict";

const bcrypt = require("bcryptjs");
const { ROLE } = require("../utils/constants");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = :name LIMIT 1`,
      {
        replacements: { name: ROLE.ADMIN },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    const passwordHash = await bcrypt.hash("Admin@123", 10);
    await queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        email: "admin@crm.local",
        passwordHash,
        firstName: "System",
        lastName: "Admin",
        roleId: adminRole.id,
        sponsorId: null,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", { email: "admin@crm.local" }, {});
  }
};

