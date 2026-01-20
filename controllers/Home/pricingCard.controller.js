const { getDB, ObjectId } = require("../../config/db");

const connectDB = async () => {
  const db = await getDb();
  return db.collection("pricing_card");
};

const getAllPricing = async (req, res) => {
  try {
    const pricingCollection = await connectDB();
    const cards = await pricingCollection.find().toArray();
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pricing cards' });
  }
};


const addPricing = async (req, res) => {
  try {
    const pricingCollection = await connectDB();
    const newCard = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await pricingCollection.insertOne(newCard);

    res.status(201).json({ message: 'Pricing card added successfully', result });

  } catch (err) {
    res.status(500).json({ error: 'Failed to add pricing card' });
  }
};

const updatePricing = async (req, res) => {
  try {
    const pricingCollection = await connectDB();
    const { id } = req.params;
    const updatedData = req.body;

    const result = await pricingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updatedData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Pricing card not found' });
    }

    res.status(200).json({ message: 'Pricing card updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

const deletePricing = async (req, res) => {
  try {
    const pricingCollection = await connectDB();
    const { id } = req.params;
    const result = await pricingCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Pricing card not found' });
    }

    res.status(200).json({ message: 'Pricing card removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = {
  getAllPricing,
  addPricing,
  updatePricing,
  deletePricing
};