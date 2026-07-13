// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const { MongoClient, ServerApiVersion } = require("mongodb");

// const uri = process.env.MONGODB_URI;
// const dbName = process.env.DB_NAME || "crowdfunding";

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
// });

// let db;

// async function connectDB() {
//     if (db) return db;
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     db = client.db(dbName);
//     return db;
// }

// function getDB() {
//     if (!db) {
//         throw new Error("Database not connected. Call connectDB() first.");
//     }
//     return db;
// }

// module.exports = { connectDB, getDB };

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { MongoClient, ServerApiVersion } = require("mongodb");

let client;
let db;

async function connectDB() {
    if (db) return db;

    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || "crowdfunding";

    if (!uri) {
        throw new Error("MONGODB_URI is not defined in .env");
    }

    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    db = client.db(dbName);
    return db;
}

function getDB() {
    if (!db) {
        throw new Error("Database not connected. Call connectDB() first.");
    }
    return db;
}

module.exports = { connectDB, getDB };