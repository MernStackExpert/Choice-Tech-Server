const { getDB, ObjectId } = require("../../config/db");
const sendEmail = require("../../utils/sendEmail");

const paymentCollection = async () => {
  const db = await getDB();
  return db.collection("payment_history");
};

const orderCollection = async () => {
  const db = await getDB();
  return db.collection("order_data");
};


const submitPayment = async (req, res) => {
  try {
    const payments = await paymentCollection();
    const orders = await orderCollection();
    
    const { 
      orderId, 
      userEmail, 
      method, 
      transactionId, 
      senderNumber, 
      paymentNumber,
      amountPaid,
      paymentScreenshot 
    } = req.body;

    const existingOrder = await orders.findOne({ orderId: orderId });
    if (!existingOrder) {
      return res.status(404).send({ success: false, message: "Invalid Order ID" });
    }

    const newPaymentRequest = {
      orderId,
      userEmail,
      method,
      transactionId,
      senderNumber,
      paymentNumber,
      amountPaid: parseFloat(amountPaid),
      paymentScreenshot: paymentScreenshot || null,
      status: "pending",
      submittedAt: new Date()
    };

    await payments.insertOne(newPaymentRequest);
    
    res.status(200).send({ 
      success: true, 
      message: "Payment details submitted. Please wait for verification." 
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Payment submission failed" });
  }
};


const getMyPaymentHistory = async (req, res) => {
  try {
    const payments = await paymentCollection();
    const { email } = req.query;

    const history = await payments
      .find({ userEmail: email })
      .sort({ submittedAt: -1 })
      .toArray();

    res.status(200).send({ success: true, data: history });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to fetch history" });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden Access" });
    }

    const payments = await paymentCollection();
    const { paymentId, status } = req.body;

    const result = await payments.updateOne(
      { _id: new ObjectId(paymentId) },
      { $set: { status: status, updatedAt: new Date() } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).send({ success: true, message: `Payment ${status} successfully` });
    } else {
      res.status(404).send({ success: false, message: "Payment record not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Status update failed" });
  }
};

const getAllPaymentRequests = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden Access" });
    }

    const payments = await paymentCollection();
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalRequests = await payments.countDocuments();
    const result = await payments
      .find({})
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      success: true,
      result,
      totalRequests,
      totalPages: Math.ceil(totalRequests / limit)
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch payment requests" });
  }
};


const getPaymentDetails = async (req, res) => {
  try {
    const payments = await paymentCollection();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid Payment ID" });
    }

    const payment = await payments.findOne({ _id: new ObjectId(id) });

    if (!payment) {
      return res.status(404).send({ success: false, message: "Payment record not found" });
    }

    if (req.user.role !== "admin" && req.user.email !== payment.userEmail) {
      return res.status(403).send({ success: false, message: "Unauthorized access to payment data" });
    }

    res.status(200).send({ success: true, data: payment });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  submitPayment,
  getAllPaymentRequests,
  getMyPaymentHistory,
  updatePaymentStatus,
  getPaymentDetails,
};