const { getDB, ObjectId } = require("../../config/db");

const getCollection = async () => {
  const db = await getDB();
  return db.collection("services_cards");
};

const getAllServices = async (req, res) => {
  try {
    const collection = await getCollection();
    const data = await collection.find().toArray();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
};

const addService = async (req, res) => {
  try {
    const collection = await getCollection();
    const newData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(newData);
    res.status(201).json({ message: 'Success', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
};

const updateService = async (req, res) => {
  try {
    const collection = await getCollection();
    const { id } = req.params;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
};

const deleteService = async (req, res) => {
  try {
    const collection = await getCollection();
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
};

module.exports = { getAllServices, addService, updateService, deleteService };