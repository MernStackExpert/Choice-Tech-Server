const { getDB, ObjectId } = require("../../config/db");

const getCollection = async () => {
  const db = await getDB();
  return db.collection("purpose_cards");
};


const getAllPurposes = async (req, res) => {
  try {
    const purposeCollection = await getCollection();
    const purposes = await purposeCollection.find().toArray();
    res.status(200).json(purposes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch purpose cards' });
  }
};


const addPurpose = async (req, res) => {
  try {
    const purposeCollection = await getCollection();
    const newPurpose = {
      ...req.body, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await purposeCollection.insertOne(newPurpose);
    res.status(201).json({ message: 'Purpose card added successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add purpose card' });
  }
};


const updatePurpose = async (req, res) => {
  try {
    const purposeCollection = await getCollection();
    const { id } = req.params;
    const updatedData = req.body;

    const result = await purposeCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updatedData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Purpose card not found' });
    }
    res.status(200).json({ message: 'Purpose card updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};


const deletePurpose = async (req, res) => {
  try {
    const purposeCollection = await getCollection();
    const { id } = req.params;
    const result = await purposeCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Purpose card not found' });
    }
    res.status(200).json({ message: 'Purpose card removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = { getAllPurposes, addPurpose, updatePurpose, deletePurpose };