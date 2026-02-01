const { getDB, ObjectId } = require("../../config/db");

const collection = async () => {
  const db = await getDB();
  return db.collection("user_info");
};

const createUserInfo = async (req, res) => {
  try {
    const infoCollection = await collection();
    const data = req.body;

    if (!data.firebaseUid || !data.email) {
      return res
        .status(400)
        .send({ message: "Missing required identification data" });
    }

    const existingInfo = await infoCollection.findOne({
      firebaseUid: data.firebaseUid,
    });

    if (existingInfo) {
      const updateResult = await infoCollection.updateOne(
        { firebaseUid: data.firebaseUid },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
          },
        },
      );
      return res
        .status(200)
        .send({
          message: "Information updated successfully",
          result: updateResult,
        });
    }

    const newUserInfo = {
      ...data,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await infoCollection.insertOne(newUserInfo);
    res.status(201).send({ message: "Information saved successfully", result });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error while saving info" });
  }
};

const getAllUserInfo = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }
    const infoCollection = await collection();
    const result = await infoCollection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch all user info" });
  }
};

// const getUserInfoByEmail = async (req, res) => {
//   try {
//     const infoCollection = await collection();
//     const email = req.params.email;
//     const result = await infoCollection.findOne({
//   email: { $regex: new RegExp(`^${email}$`, 'i') }
// });

//     if (!result) {
//       return res.status(404).send({ message: "User information not found" });
//     }
//     res.status(200).send(result);
//   } catch (error) {
//     res.status(500).send({ message: "Failed to fetch user info by email" });
//   }
// };

const getUserInfoByUid = async (req, res) => {
  try {
    const infoCollection = await collection();
    const uid = req.params.uid;

    const result = await infoCollection.findOne({ firebaseUid: uid });

    if (!result) {
      return res
        .status(404)
        .send({ message: "User information not found in node cluster" });
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch user info by UID" });
  }
};

const updateUserInfoById = async (req, res) => {
  try {
    const infoCollection = await collection();
    const id = req.params.id;
    const updateData = req.body;

    const result = await infoCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "User info not found" });
    }

    res.status(200).send({ message: "User info updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to update user info" });
  }
};

const deleteUserInfoById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }

    const infoCollection = await collection();
    const id = req.params.id;

    const result = await infoCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "User info not found" });
    }

    res.status(200).send({ message: "User info deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete user info" });
  }
};

module.exports = {
  createUserInfo,
  getAllUserInfo,
  getUserInfoByUid,
  updateUserInfoById,
  deleteUserInfoById,
};
