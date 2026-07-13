const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const MIN_WITHDRAWAL_CREDITS = 200;

async function createWithdrawal(req, res) {
    try {
        const db = getDB();
        const creatorId = req.user.id;
        const { amount, paymentMethod, accountDetails } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }
        if (!paymentMethod || !accountDetails) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        // Total raised across all approved campaigns of this creator
        const campaigns = await db.collection("campaigns")
            .find({ creatorId, status: "approved" })
            .toArray();
        const totalEarned = campaigns.reduce((sum, c) => sum + (c.raisedCredits || 0), 0);

        // Already pending/approved withdrawals
        const existingWithdrawals = await db.collection("withdrawals")
            .find({ creatorId, status: { $in: ["pending", "approved"] } })
            .toArray();
        const alreadyUsed = existingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

        const availableBalance = totalEarned - alreadyUsed;

        if (totalEarned < MIN_WITHDRAWAL_CREDITS) {
            return res.status(400).json({
                success: false,
                message: `Minimum ${MIN_WITHDRAWAL_CREDITS} credits raised required to withdraw`,
            });
        }

        if (Number(amount) > availableBalance) {
            return res.status(400).json({ success: false, message: "Insufficient available balance" });
        }

        const withdrawal = {
            creatorId,
            amount: Number(amount),
            paymentMethod,
            accountDetails,
            status: "pending",
            createdAt: new Date(),
        };

        const result = await db.collection("withdrawals").insertOne(withdrawal);

        res.status(201).json({ success: true, data: { _id: result.insertedId, ...withdrawal } });
    } catch (err) {
        console.error("Error creating withdrawal:", err);
        res.status(500).json({ success: false, message: "Failed to create withdrawal request" });
    }
}

async function getWithdrawals(req, res) {
    try {
        const db = getDB();
        const { creatorId, status } = req.query;

        const filter = {};
        if (creatorId) filter.creatorId = creatorId;
        if (status) filter.status = status;

        const withdrawals = await db.collection("withdrawals")
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({ success: true, data: withdrawals });
    } catch (err) {
        console.error("Error fetching withdrawals:", err);
        res.status(500).json({ success: false, message: "Failed to fetch withdrawals" });
    }
}

async function updateWithdrawalStatus(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const result = await db.collection("withdrawals").findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { status } },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: "Withdrawal not found" });
        }

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error("Error updating withdrawal:", err);
        res.status(500).json({ success: false, message: "Failed to update withdrawal" });
    }
}

module.exports = { createWithdrawal, getWithdrawals, updateWithdrawalStatus };