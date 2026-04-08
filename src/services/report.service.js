const db = require("../models");

const buildCaseSummary = async () => {
  const rows = await db.Case.findAll({
    attributes: ["status", [db.Sequelize.fn("COUNT", db.Sequelize.col("status")), "count"]],
    group: ["status"]
  });
  return rows.map((r) => ({ status: r.get("status"), count: Number(r.get("count")) }));
};

module.exports = { buildCaseSummary };
