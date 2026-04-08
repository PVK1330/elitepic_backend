"use strict";

const { ROLE } = require("../utils/constants");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const roles = await queryInterface.sequelize.query(`SELECT id, name FROM roles`, {
      type: Sequelize.QueryTypes.SELECT
    });

    const roleIdByName = Object.fromEntries(roles.map((r) => [r.name, r.id]));

    const permissions = [];
    const addPerms = (roleName, perms) => {
      perms.forEach((p) =>
        permissions.push({
          id: uuidv4(),
          name: p,
          roleId: roleIdByName[roleName],
          createdAt: now,
          updatedAt: now
        })
      );
    };

    addPerms(ROLE.ADMIN, ["*"]);
    addPerms(ROLE.CASEWORKER, [
      "case:create",
      "case:update",
      "task:create",
      "task:update",
      "document:upload"
    ]);
    addPerms(ROLE.CANDIDATE, ["case:own:read", "document:own:read"]);
    addPerms(ROLE.SPONSOR, ["case:company:read", "sponsor:own:read"]);

    await queryInterface.bulkInsert("permissions", permissions);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("permissions", null, {});
  }
};

