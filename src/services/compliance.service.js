const db = require("../models");

const calculateRiskScore = (record) => {
  let score = 0;
  if (record.visaExpiryDate && new Date(record.visaExpiryDate) < new Date(Date.now() + 30 * 86400000)) score += 40;
  if (record.licenceExpiryDate && new Date(record.licenceExpiryDate) < new Date(Date.now() + 30 * 86400000)) score += 40;
  if (!record.isCompliant) score += 20;
  return Math.min(score, 100);
};

const flagRisk = async (complianceRecordId) => {
  const record = await db.Compliance.findByPk(complianceRecordId);
  const riskScore = calculateRiskScore(record);
  return db.Compliance.update(
    { riskScore, flagged: riskScore >= 60 },
    { where: { id: complianceRecordId }, returning: true }
  ).then(([, rows]) => rows[0]);
};

module.exports = { calculateRiskScore, flagRisk };
