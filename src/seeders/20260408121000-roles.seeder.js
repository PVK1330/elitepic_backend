"use strict";

const { ROLE } = require("../utils/constants");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("roles", [
      { id: 1, name: ROLE.ADMIN, created_at: now, updated_at: now },
      { id: 2, name: ROLE.CASEWORKER, created_at: now, updated_at: now },
      { id: 3, name: ROLE.CANDIDATE, created_at: now, updated_at: now },
      { id: 4, name: ROLE.SPONSOR, created_at: now, updated_at: now }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", null, {});
  }
};

