const admin = require("firebase-admin");
const serviceAccount = require("../choich-tech-firebase-auth-cradential.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
