const { getDB } = require("../../config/db");

const getAdminStats = async (req, res) => {
  try {
    const db = await getDB();
    const orderCollection = db.collection("order_data");
    const userCollection = db.collection("user_data");
    const paymentCollection = db.collection("payment_history");
    const orderStats = await orderCollection.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paidAmount" },
          totalDue: { $sum: "$unPaidAmount" },
          totalOrders: { $sum: 1 },
          activeNodes: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          }
        }
      }
    ]).toArray();

    const stats = orderStats[0] || {
      totalRevenue: 0,
      totalDue: 0,
      totalOrders: 0,
      activeNodes: 0,
      pendingOrders: 0
    };

    const totalCustomers = await userCollection.countDocuments({ role: "user" });

    const newPaymentRequests = await paymentCollection.countDocuments({ status: "pending" });

    const latestOrders = await orderCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const latestPayments = await paymentCollection
      .find({})
      .sort({ submittedAt: -1 })
      .limit(5)
      .toArray();

    res.status(200).send({
      success: true,
      data: {
        metrics: {
          totalRevenue: stats.totalRevenue,
          totalDue: stats.totalDue,
          totalOrders: stats.totalOrders,
          activeNodes: stats.activeNodes,
          pendingOrders: stats.pendingOrders,
          totalCustomers,
          newPaymentRequests,
        },
        latestOrders,
        latestPayments,
      }
    });

  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).send({ success: false, message: "Failed to fetch admin dashboard stats" });
  }
};

module.exports = { getAdminStats };