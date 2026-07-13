const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole } = require("../controllers/user.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.get("/", requireAuth, requireRole("admin"), getAllUsers);
router.patch("/:id/role", requireAuth, requireRole("admin"), updateUserRole);

module.exports = router;