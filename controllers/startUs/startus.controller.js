const { getDB, ObjectId } = require("../../config/db");

const getCollection = async () => {
  const db = await getDB();
  return db.collection("startup_message");
};

const getAllstartupMessage = async (req, res) => {
  try {
    const startupCollection = await getCollection();
    const query = {};

    if (req.query.email) {
      query.email = req.query.email;
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    //total message
    const totalMessage = await startupCollection.countDocuments(query);

    const result = await startupCollection
      .find(query)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      result,
      totalPage: Math.ceil(totalMessage / limit),
      totalMessage,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed To Fetch startup Message" });
  }
};

const addStartupMessage = async (req, res) => {
  try {
    const startupCollection = await getCollection();

    let message = {
      ...req.body,
      status: "pending",
      sendAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await startupCollection.insertOne(message);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create Message", error });
  }
};

const updateStartupMessage = async (req, res) => {
  try {
    const startupCollection = await getCollection();

    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Message ID format" });
    }
    const result = await startupCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Message Not Found" });
    }

    res.send({ message: "Message updated successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to update Message", error });
  }
};

const deleteStartupMessage = async (req, res) => {
  try {
    const startupCollection = await getCollection();

    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Message ID format" });
    }
    const result = await startupCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Message Not Found" });
    }

    res.send({ message: "Message deleted successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete Message", error });
  }
};

module.exports = {
  getAllstartupMessage,
  addStartupMessage,
  updateStartupMessage,
  deleteStartupMessage,
};
