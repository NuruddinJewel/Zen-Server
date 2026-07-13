const express = require("express");
const router = express.Router();
const { createCampaign, getCampaigns, getCampaignById, updateCampaignStatus } = require("../controllers/campaign.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", requireAuth, requireRole("creator"), createCampaign);

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", requireAuth, requireRole("creator"), createCampaign);
router.patch("/:id/status", requireAuth, requireRole("admin"), updateCampaignStatus);

module.exports = router;

module.exports = router;