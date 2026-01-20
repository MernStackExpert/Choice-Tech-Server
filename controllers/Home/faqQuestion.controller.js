const { getDB, ObjectId } = require("../../config/db");

const getCollection = async () => {
  const db = await getDB();
  return db.collection("faq_question");
};

const getAllFAQs = async (req, res) => {
  try {
    const faqCollection = await getCollection();
    const faqs = await faqCollection.find().toArray();
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

const addFAQ = async (req, res) => {
  try {
    const faqCollection = await getCollection();
    const newFaq = {
      ...req.body, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await faqCollection.insertOne(newFaq);
    res.status(201).json({ message: 'FAQ added successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
};

const updateFAQ = async (req, res) => {
  try {
    const faqCollection = await getCollection();
    const { id } = req.params;
    const updatedData = req.body;

    const result = await faqCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updatedData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.status(200).json({ message: 'FAQ updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};


const deleteFAQ = async (req, res) => {
  try {
    const faqCollection = await getCollection();
    const { id } = req.params;
    const result = await faqCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.status(200).json({ message: 'FAQ removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = { getAllFAQs, addFAQ, updateFAQ, deleteFAQ };