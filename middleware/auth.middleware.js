const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

async function requireAuth(req, res, next) {
    try {
        const sessionToken = req.cookies?.["better-auth.session_token"];

        if (!sessionToken) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // better-auth session_token cookie format: "token.signature"
        const rawToken = sessionToken.split(".")[0];

        const db = getDB();
        const session = await db.collection("session").findOne({ token: rawToken });

        if (!session || new Date(session.expiresAt) < new Date()) {
            return res.status(401).json({ message: "Session expired or invalid" });
        }

        const user = await db.collection("user").findOne({
            _id: new ObjectId(session.userId),
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ message: "Authentication error" });
    }
}

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: insufficient role" });
        }
        next();
    };
}

module.exports = { requireAuth, requireRole };