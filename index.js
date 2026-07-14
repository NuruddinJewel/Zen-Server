// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const Stripe = require('stripe');
// const { MongoClient, ServerApiVersion } = require('mongodb');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const uri = process.env.MONGODB_URI;
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// app.use(cors());
// app.use(express.json());

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// app.get('/', (req, res) => {
//     res.send('Crowdfunding backend running')
// })

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         // await client.close();
//     }
// }
// run().catch(console.dir);



// app.listen(PORT, () => {
//     console.log(`Example app listening on port ${PORT}`)
// })


//2

// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const dotenv = require("dotenv");
// dotenv.config();

// const express = require("express");
// const cors = require("cors");
// const { connectDB } = require("./config/db");
// const categoryRoutes = require("./routes/category.routes");
// const campaignRoutes = require("./routes/campaign.routes");
// const app = express();
// const PORT = process.env.PORT || 5000;

// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Crowdfunding backend running");
// });

// app.use("/api/categories", categoryRoutes);
// app.use("/api/campaigns", campaignRoutes);

// async function start() {
//     try {
//         await connectDB();
//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     } catch (err) {
//         console.error("Failed to connect to DB:", err);
//         process.exit(1);
//     }
// }

// start();

//3

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const categoryRoutes = require("./routes/category.routes");
const campaignRoutes = require("./routes/campaign.routes");
const contributionRoutes = require("./routes/contribution.routes");
const withdrawalRoutes = require("./routes/withdrawal.routes");
const userRoutes = require("./routes/user.routes");
const reportRoutes = require("./routes/report.routes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({
    origin: "process.env.FRONTEND_URL",
    credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Crowdfunding backend running");
});

app.use("/api/categories", categoryRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to DB:", err);
        process.exit(1);
    }
}

start();