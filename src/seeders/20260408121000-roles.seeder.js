"use strict";

const { ROLE } = require("../utils/constants");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("roles", [
      { id: require("uuid").v4(), name: ROLE.ADMIN, createdAt: now, updatedAt: now },
      { id: require("uuid").v4(), name: ROLE.CASEWORKER, createdAt: now, updatedAt: now },
      { id: require("uuid").v4(), name: ROLE.CANDIDATE, createdAt: now, updatedAt: now },
      { id: require("uuid").v4(), name: ROLE.SPONSOR, createdAt: now, updatedAt: now }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", null, {});
  }
};

