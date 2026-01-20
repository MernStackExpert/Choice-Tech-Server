const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("choich_tech_db");
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
  }
}

const getDB = () => db;

module.exports = {connectDB , getDB , ObjectId}