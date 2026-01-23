const { getDB, ObjectId } = require("../../config/db");
const sendEmail = require("../../utils/sendEmail")

const collection = async () => {
  const db = await getDB();
  return db.collection("user_data");
};

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }

    const userCollection = await collection();

    let query = {};

    if (req.query.email) {
      query.email = req.query.email;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalUsers = await userCollection.countDocuments(query);

    const result = await userCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      result,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).send({ message: "Failed To Fetch Users Data" });
  }
};

const createUsers = async (req, res) => {
  try {
    const userCollection = await collection();

    const { firebaseUid, email, displayName, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).send({ message: "Invalid user data" });
    }

    const exist = await userCollection.findOne({ firebaseUid });
    if (exist) {
      return res.status(200).send(exist);
    }

    const user = {
      firebaseUid,
      email,
      name: displayName || "",
      photoURL: photoURL || "",
      role: "user",
      onForm: false,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await userCollection.insertOne(user);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Welcome to Choice Technology 🎉</h2>
        <p>Hello ${displayName || "User"},</p>
        <p>Your account has been successfully created.</p>
        <p>Our admin will send you a separate email with your login credentials.</p>
        <p>You can visit Your Dashboard using the link below:</p>
        <a href="${process.env.WEBSITE_URL}" target="_blank">
          ${process.env.WEBSITE_URL}
        </a>
        <br /><br />
        <p>Thank you for choosing us.</p>
        <p><strong>Choice Technology Team</strong></p>
      </div>
    `;

    await sendEmail(
      email,
      "Welcome to Choice Technology",
      htmlContent
    );

    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create User" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userCollection = await collection();
    const { firebaseUid } = req.user;

    const allowedFields = ["name", "photoURL"];
    const updateData = {};

    for (let field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const result = await userCollection.updateOne(
      { firebaseUid },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to update profile" });
  }
};

const adminUpdateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }

    const userCollection = await collection();
    const id = req.params.id;

    const allowedFields = ["role", "isActive", "onForm"];
    const updateData = {};

    for (let field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const targetUser = await userCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!targetUser) {
      return res.status(404).send({ message: "User not found" });
    }

    if (
      updateData.role &&
      targetUser.firebaseUid === req.user.firebaseUid
    ) {
      return res
        .status(400)
        .send({ message: "Admin cannot change own role" });
    }

    if (
      updateData.role &&
      !["admin", "user"].includes(updateData.role)
    ) {
      return res.status(400).send({ message: "Invalid role value" });
    }

    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    res.send({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }

    const userCollection = await collection();
    const id = req.params.id;

    const result = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  createUsers,
  updateProfile,
  adminUpdateUser,
  deleteUser,
};
