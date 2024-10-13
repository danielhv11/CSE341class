const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
let db;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // Added options here

async function connectDB() {
    try {
        await client.connect();
        db = client.db('CSE341'); // Make sure 'CSE341' is the correct database name
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
    }
}

function getDB() {
    if (!db) {
        throw new Error('Db not initialized');
    }
    return db;
}

// Export the connectDB function to call it when starting your server
module.exports = { connectDB, getDB };
