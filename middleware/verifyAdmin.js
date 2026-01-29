const { getDB } = require("../config/db");

const verifyAdmin = async (req, res, next) => {
    try {
        const user = req.user; 
        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const db = await getDB();
        const userCollection = db.collection("user_data");

        const dbUser = await userCollection.findOne({ firebaseUid: user.uid });

        if (!dbUser || dbUser.role !== 'admin') {
            return res.status(403).send({ message: 'Forbidden Access: Admins Only' });
        }

        req.user = dbUser; 
        
        next();
    } catch (error) {
        console.error("VerifyAdmin Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = verifyAdmin;