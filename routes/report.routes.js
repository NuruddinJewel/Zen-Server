const express = require("express");
const router = express.Router();
const { getReports, updateReportStatus, createReport } = require("../controllers/report.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.get("/", requireAuth, requireRole("admin"), getReports);
router.post("/", requireAuth, requireRole("creator"), createReport);
router.patch("/:id/status", requireAuth, requireRole("admin"), updateReportStatus);

module.exports = router;