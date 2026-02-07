const { getDB, ObjectId } = require("../../config/db");
const sendEmail = require("../../utils/sendEmail");

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
    const { firebaseUid, email, displayName, photoURL, password } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).send({ message: "Invalid user data" });
    }

    const exist = await userCollection.findOne({ firebaseUid });

    if (exist) {
      const updateDoc = {
        $set: {
          name: displayName || exist.name,
          photoURL: photoURL || exist.photoURL,
          updatedAt: new Date(),
        },
      };

      await userCollection.updateOne({ firebaseUid }, updateDoc);
      const updatedUser = await userCollection.findOne({ firebaseUid });
      return res.status(200).send(updatedUser);
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
    const savedUser = await userCollection.findOne({ _id: result.insertedId });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #222; background: #0a0a0a; padding: 30px; border-radius: 20px;">
        <h2 style="color: #22d3ee; text-align: center; text-transform: uppercase;">Welcome to Choice Technology 🎉</h2>
        <p style="color: #fff;">Hello <strong>${displayName || "User"}</strong>,</p>
        <p style="color: #ccc;">Your account has been successfully created in our neural network. Here are your credentials for future reference:</p>
        
        <div style="background: rgba(34, 211, 238, 0.1); border: 1px solid #22d3ee; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <p style="margin: 5px 0; color: #fff;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0; color: #fff;"><strong>Password:</strong> <span style="color: #22d3ee;">${password}</span></p>
        </div>

        <div style="background: #111; padding: 20px; border-radius: 15px; border-left: 4px solid #22d3ee;">
          <p style="margin: 0; color: #22d3ee; font-weight: bold; font-size: 14px;">NEXT STEPS:</p>
          <ul style="color: #ccc; font-size: 13px; padding-left: 20px;">
            <li>Login to your dashboard and submit the <strong>Onboarding Form</strong>.</li>
            <li>GO To <strong> Settings</strong> and Change Your <strong>Password</strong>.</li>
            <li>Go to <strong> Settings</strong> to verify your email address.</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.WEBSITE_URL}" style="background: #22d3ee; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; text-transform: uppercase; font-size: 12px;">Access Your Node</a>
        </div>
        
        <p style="color: #666; font-size: 11px; margin-top: 30px; text-align: center;">Choice Technology Team © 2026 | Secure Ecosystem</p>
      </div>
    `;

    await sendEmail(email, "Your Choice Technology Credentials", htmlContent);

    res.status(201).send(savedUser);
  } catch (error) {
    res.status(500).send({ message: "Failed to create User" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userCollection = await collection();

    const firebaseUid = req.user?.firebaseUid || req.body.firebaseUid;

    if (!firebaseUid) {
      return res.status(400).send({ message: "No identification found" });
    }

    const allowedFields = ["name", "photoURL", "onForm"];
    const updateData = {};

    for (let field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const result = await userCollection.updateOne(
      { firebaseUid: firebaseUid },
      { $set: { ...updateData, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ message: "User not found in choice-tech database" });
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

    if (updateData.role && targetUser.firebaseUid === req.user.firebaseUid) {
      return res.status(400).send({ message: "Admin cannot change own role" });
    }

    if (updateData.role && !["admin", "user"].includes(updateData.role)) {
      return res.status(400).send({ message: "Invalid role value" });
    }

    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
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


const getSingleUser = async (req, res) => {
  try {
    const userCollection = await collection();
    const { uid } = req.params; 

    if (!uid) {
      return res.status(400).send({ success: false, message: "Firebase UID is required" });
    }

    const user = await userCollection.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found in database" });
    }

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching single user:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};


module.exports = {
  getAllUsers,
  createUsers,
  getSingleUser,
  updateProfile,
  adminUpdateUser,
  deleteUser,
};
