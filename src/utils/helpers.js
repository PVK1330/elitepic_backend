const buildPagination = (query) => {
  const page = Number(query.page || 1);
  const limit = Math.min(Number(query.limit || 20), 100);
  return { skip: (page - 1) * limit, take: limit, page, limit };
};

const toDate = (value) => (value ? new Date(value) : null);

const db = require("../models");
const logAudit = (payload) =>
  db.AuditLog.create({
    userId: payload.userId || null,
    action: payload.action,
    entity: payload.entity,
    entityId: payload.entityId || null,
    payload: payload.payload || {}
  });

module.exports = { buildPagination, toDate, logAudit };
