const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");


const createContribution = async (req, res) => {
    const { campaignId, supporterId, amount } = req.body;

    if (!campaignId || !supporterId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid input data." });
    }

    try {
        const db = getDB();

        const user = await db.collection("user").findOne({ _id: new ObjectId(supporterId) });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        if ((user.credits || 0) < amount) {
            return res.status(400).json({ success: false, message: "Insufficient credits." });
        }

        await db.collection("user").updateOne(
            { _id: new ObjectId(supporterId) },
            { $inc: { credits: -Number(amount) } }
        );

        const campaignUpdate = await db.collection("campaigns").updateOne(
            { _id: new ObjectId(campaignId) },
            { $inc: { raisedCredits: Number(amount) } }
        );

        if (campaignUpdate.matchedCount === 0) {
            await db.collection("user").updateOne(
                { _id: new ObjectId(supporterId) },
                { $inc: { credits: Number(amount) } }
            );
            return res.status(404).json({ success: false, message: "Campaign not found." });
        }

        const newContribution = {
            campaignId: new ObjectId(campaignId),
            supporterId: new ObjectId(supporterId),
            amount: Number(amount),
            createdAt: new Date(),
        };
        await db.collection("contributions").insertOne(newContribution);

        res.status(201).json({
            success: true,
            message: `Successfully contributed ${amount} credits!`,
        });

    } catch (error) {
        console.error("Contribution Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to complete contribution process.",
            error: error.message,
        });
    }
};

// @desc    Get all contributions made by a specific supporter
// @route   GET /api/contributions
const getSupporterContributions = async (req, res) => {
    const { supporterId } = req.query;

    if (!supporterId) {
        return res.status(400).json({ success: false, message: "Supporter ID is required." });
    }

    try {
        const db = getDB();

        //  (Join/Lookup) 
        const contributions = await db.collection("contributions")
            .aggregate([
                { $match: { supporterId: new ObjectId(supporterId) } },
                {
                    $lookup: {
                        from: "campaigns",
                        localField: "campaignId",
                        foreignField: "_id",
                        as: "campaignDetails",
                    },
                },
                { $unwind: "$campaignDetails" },
                { $sort: { createdAt: -1 } }
            ])
            .toArray();

        res.status(200).json({
            success: true,
            count: contributions.length,
            data: contributions,
        });
    } catch (error) {
        console.error("Fetch Contributions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch contributions.",
            error: error.message,
        });
    }
};

module.exports = {
    createContribution,
    getSupporterContributions,
};