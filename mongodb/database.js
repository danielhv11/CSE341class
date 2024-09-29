const { MongoClient } = require('mongodb');
require('dotenv').config(); 

const uri = process.env.MONGO_URI; 
let db;

async function connectDB() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db('CSE341');
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

(async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error('Error during DB connection:', error);
    }
})();

module.exports = { connectDB, getDB };
