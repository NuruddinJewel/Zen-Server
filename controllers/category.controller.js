const { getDB } = require("../config/db");

async function getAllCategories(req, res) {
    try {
        const db = getDB();
        const categories = await db.collection("categories").find({}).toArray();
        res.status(200).json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
}

module.exports = { getAllCategories };