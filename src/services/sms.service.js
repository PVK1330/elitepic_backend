const sendSMS = async ({ to, message }) => {
  return { to, message, status: "queued" };
};

module.exports = { sendSMS };
