const cron = require("node-cron");
const { getDB } = require("../config/db"); 
const sendEmail = require("./sendEmail"); 

const initCronJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const db = getDB();
      if (!db) {
        console.error("[CRON]: Database connection not established yet.");
        return;
      }

      const orderCollection = db.collection("order_data");
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const expiringOrders = await orderCollection.find({
        status: "active",
        expiryDate: {
          $gte: new Date(),
          $lte: tomorrow
        }
      }).toArray();

      for (const order of expiringOrders) {
        const htmlContent = `
          <div style="font-family: Arial; padding: 20px; background: #0a0a0a; color: #fff; border-radius: 15px; border: 1px solid #22d3ee; max-width: 500px; margin: auto;">
            <h2 style="color: #22d3ee; text-align: center;">Subscription Alert! ⚠️</h2>
            <p>Hello,</p>
            <p>Your subscription for <b>${order.orderTitle}</b> will expire in 24 hours.</p>
            <p>Please pay your fees to keep the service active.</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.WEBSITE_URL}/my-cluster" style="background: #22d3ee; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Renew Now</a>
            </div>
            <p style="font-size: 10px; color: #666; margin-top: 20px; text-align: center;">Choice Technology Team © 2026</p>
          </div>
        `;

        await sendEmail(order.userEmail, "Action Required: Subscription Expiring Soon", htmlContent);
      }
      
      console.log(`[CRON] Processed: ${expiringOrders.length} expiry notifications.`);
    } catch (error) {
      console.error("[CRON ERROR]:", error);
    }
  });
};

module.exports = initCronJob;