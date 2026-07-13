const express = require("express");
const router = express.Router();
const { getReports, updateReportStatus } = require("../controllers/report.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.get("/", requireAuth, requireRole("admin"), getReports);
router.patch("/:id/status", requireAuth, requireRole("admin"), updateReportStatus);

module.exports = router;