const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

async function createCampaign(req, res) {
    try {
        const db = getDB();
        const { title, description, category, goalCredits, coverImage, deadline } = req.body;

        if (!title || !description || !category || !goalCredits) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const campaign = {
            title,
            description,
            creatorId: req.user.id,
            category,
            goalCredits: Number(goalCredits),
            raisedCredits: 0,
            status: "pending",
            coverImage: coverImage || null,
            deadline: deadline ? new Date(deadline) : null,
            createdAt: new Date(),
            updates: [],
        };

        const result = await db.collection("campaigns").insertOne(campaign);

        res.status(201).json({ _id: result.insertedId, ...campaign });
    } catch (err) {
        console.error("Error creating campaign:", err);
        res.status(500).json({ message: "Failed to create campaign" });
    }
}

async function getCampaigns(req, res) {
    try {
        const db = getDB();
        const { status, category, limit, creatorId } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (creatorId) filter.creatorId = creatorId;

        let query = db.collection("campaigns").find(filter).sort({ createdAt: -1 });
        if (limit) query = query.limit(Number(limit));

        const campaigns = await query.toArray();
        res.status(200).json(campaigns);
    } catch (err) {
        console.error("Error fetching campaigns:", err);
        res.status(500).json({ message: "Failed to fetch campaigns" });
    }
}

async function getCampaignById(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;

        const campaign = await db.collection("campaigns").findOne({ _id: new ObjectId(id) });

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        res.status(200).json(campaign);
    } catch (err) {
        console.error("Error fetching campaign:", err);
        res.status(500).json({ message: "Failed to fetch campaign" });
    }
}
//Update Campaign Status

async function updateCampaignStatus(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["approved", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const result = await db.collection("campaigns").findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { status } },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error("Error updating campaign status:", err);
        res.status(500).json({ message: "Failed to update campaign status" });
    }
}

module.exports = { createCampaign, getCampaigns, getCampaignById, updateCampaignStatus };