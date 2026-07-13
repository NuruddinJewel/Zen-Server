const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

async function getAllUsers(req, res) {
    try {
        const db = getDB();
        const users = await db
            .collection("user")
            .find({}, { projection: { name: 1, email: 1, role: 1, credits: 1, createdAt: 1 } })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
}

async function updateUserRole(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ["supporter", "creator", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const result = await db.collection("user").findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { role } },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error("Error updating user role:", err);
        res.status(500).json({ success: false, message: "Failed to update role" });
    }
}

module.exports = { getAllUsers, updateUserRole };