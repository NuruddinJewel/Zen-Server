const express = require("express");
const router = express.Router();
const {
    createContribution,
    getSupporterContributions,
} = require("../controllers/contribution.controller");

router.post("/", createContribution);
router.get("/", getSupporterContributions);

module.exports = router;