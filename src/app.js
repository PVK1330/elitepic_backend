const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
// const userRoutes = require("./src/routes/user.routes");
// const roleRoutes = require("./src/routes/role.routes");
// const caseRoutes = require("./src/routes/case.routes");
// const documentRoutes = require("./src/routes/document.routes");
// const taskRoutes = require("./src/routes/task.routes");
// const workflowRoutes = require("./src/routes/workflow.routes");
// const paymentRoutes = require("./src/routes/payment.routes");
// const invoiceRoutes = require("./src/routes/invoice.routes");
// const notificationRoutes = require("./src/routes/notification.routes");
// const messageRoutes = require("./src/routes/message.routes");
// const reportRoutes = require("./src/routes/report.routes");
// const complianceRoutes = require("./src/routes/compliance.routes");
// const auditRoutes = require("./src/routes/audit.routes");
// const sponsorRoutes = require("./src/routes/sponsor.routes");
// const cosRoutes = require("./src/routes/cos.routes");
// const hrFileRoutes = require("./src/routes/hrFile.routes");
// const candidateRoutes = require("./src/routes/candidate.routes");
// const applicationRoutes = require("./src/routes/application.routes");
// const dashboardRoutes = require("./src/routes/dashboard.routes");
// const settingsRoutes = require("./src/routes/settings.routes");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/roles", roleRoutes);
// app.use("/api/cases", caseRoutes);
// app.use("/api/documents", documentRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/workflows", workflowRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/invoices", invoiceRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/api/compliance", complianceRoutes);
// app.use("/api/audits", auditRoutes);
// app.use("/api/sponsors", sponsorRoutes);
// app.use("/api/cos", cosRoutes);
// app.use("/api/hr-files", hrFileRoutes);
// app.use("/api/candidates", candidateRoutes);
// app.use("/api/applications", applicationRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/settings", settingsRoutes);

app.use(errorMiddleware);

module.exports = app;
