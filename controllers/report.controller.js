const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

async function getReports(req, res) {
    try {
        const db = getDB();
        const { status } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const reports = await db.collection("reports").find(filter).sort({ createdAt: -1 }).toArray();
        res.status(200).json({ success: true, data: reports });
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ success: false, message: "Failed to fetch reports" });
    }
}

async function updateReportStatus(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;
        const { status } = req.body;

        if (!["resolved", "dismissed"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const result = await db.collection("reports").findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { status } },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error("Error updating report:", err);
        res.status(500).json({ success: false, message: "Failed to update report" });
    }
}

//Creator Reports

async function createReport(req, res) {
    try {
        const db = getDB();
        const { subject, description, campaignId } = req.body;

        if (!subject || !description) {
            return res.status(400).json({ success: false, message: "Subject and description are required" });
        }

        const report = {
            creatorId: req.user.id,
            campaignId: campaignId || null,
            subject,
            description,
            status: "pending",
            createdAt: new Date(),
        };

        const result = await db.collection("reports").insertOne(report);

        res.status(201).json({ success: true, data: { _id: result.insertedId, ...report } });
    } catch (err) {
        console.error("Error creating report:", err);
        res.status(500).json({ success: false, message: "Failed to submit report" });
    }
}

module.exports = { getReports, updateReportStatus, createReport };

