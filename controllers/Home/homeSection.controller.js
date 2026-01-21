const { getDB, ObjectId } = require("../../config/db");

const getCollection = async () => {
  const db = await getDB();
  return db.collection("home_section");
};


const getHomeContent = async (req, res) => {
  try {
    const collection = await getCollection();
    const content = await collection.find({}).toArray();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateMissionVision = async (req, res) => {
  try {
    const { mission, vision } = req.body;
    const collection = await getCollection();

    const updateDoc = {
      $set: {
        mission: mission,
        vision: vision,
      },
    };

    await collection.updateOne({}, updateDoc, { upsert: true });
    res.status(200).json({ message: "Mission & Vision updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMissionVision = async (req, res) => {
  try {
    const { mission, vision } = req.body;
    const collection = await getCollection();

    const existing = await collection.findOne({});
    if (existing && (existing.mission || existing.vision)) {
      return res.status(400).json({ message: "Content already exists. Use Update/Patch instead." });
    }

    const newDoc = {
      mission: mission, 
      vision: vision, 
      faq: [] 
    };

    await collection.insertOne(newDoc);
    res.status(201).json({ message: "Mission & Vision created successfully", data: newDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const collection = await getCollection();

    const newFAQ = {
      id: new ObjectId().toString(),
      question,
      answer,
    };

    await collection.updateOne(
      {},
      { $push: { faq: newFAQ } },
      { upsert: true }
    );
    res.status(201).json({ message: "FAQ added successfully", faq: newFAQ });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const collection = await getCollection();

    await collection.updateOne(
      { "faq.id": id },
      {
        $set: {
          "faq.$.question": question,
          "faq.$.answer": answer,
        },
      }
    );
    res.status(200).json({ message: "FAQ updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getCollection();

    await collection.updateOne(
      {},
      { $pull: { faq: { id: id } } }
    );
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getHomeContent,
  updateMissionVision,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  createMissionVision
};