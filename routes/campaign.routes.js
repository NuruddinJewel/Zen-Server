const express = require("express");
const router = express.Router();
const { createCampaign, getCampaigns, getCampaignById } = require("../controllers/campaign.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", requireAuth, requireRole("creator"), createCampaign);

module.exports = router;