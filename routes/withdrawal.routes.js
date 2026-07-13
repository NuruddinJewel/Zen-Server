const express = require("express");
const router = express.Router();
const {
    createWithdrawal,
    getWithdrawals,
    updateWithdrawalStatus,
} = require("../controllers/withdrawal.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.post("/", requireAuth, requireRole("creator"), createWithdrawal);
router.get("/", requireAuth, getWithdrawals);
router.patch("/:id/status", requireAuth, requireRole("admin"), updateWithdrawalStatus);

module.exports = router;