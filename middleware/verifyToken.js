const admin = require("../config/firebase.config");
const { getDB } = require("../config/db");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = await admin.auth().verifyIdToken(token);
    
    const db = await getDB();
    const dbUser = await db.collection("user_data").findOne({ email: decoded.email });

    req.user = {
      ...decoded,
      role: dbUser?.role || "user"
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).send({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;