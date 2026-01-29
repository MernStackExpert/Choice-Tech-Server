const { getDB, ObjectId } = require("../../config/db");
const sendEmail = require("../../utils/sendEmail");

const collection = async () => {
  const db = await getDB();
  return db.collection("order_data");
};

// const createOrder = async (req, res) => {
//   try {
//     const orderCollection = await collection();
//     const {
//       userId,
//       userEmail,
//       orderTitle,
//       category,
//       planType,
//       duration,
//       totalAmount,
//       description,
//       requirementFile,
//     } = req.body;

//     const randomOrderId = `CT-${Math.floor(1000 + Math.random() * 90000)}`;
//     const monthlyFee =
//       planType === "monthly"
//         ? (parseFloat(totalAmount) / parseInt(duration)).toFixed(2)
//         : 0;

//     let expiryDate = new Date();

//     if (planType === "monthly") {
//       expiryDate.setMonth(expiryDate.getMonth() + 1);
//     } else if (planType === "days") {
//       expiryDate.setDate(expiryDate.getDate() + parseInt(duration));
//     }

//     const newOrder = {
//       userId,
//       userEmail,
//       category,
//       orderTitle,
//       description,
//       requirementFile: requirementFile || null,
//       orderId: randomOrderId,
//       progress: 0,
//       planType,
//       duration: parseInt(duration),
//       totalAmount: parseFloat(totalAmount),
//       monthlyFee: parseFloat(monthlyFee),
//       paidAmount: 0,
//       unPaidAmount: parseFloat(totalAmount),
//       expiryDate: expiryDate,
//       status: "pending",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await orderCollection.insertOne(newOrder);

//     const htmlContent = `
//       <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #222; background: #0a0a0a; padding: 30px; border-radius: 20px; margin: auto;">
//         <h2 style="color: #22d3ee; text-align: center; text-transform: uppercase;">New Node Initialized 🚀</h2>
//         <p style="color: #fff;">Hello,</p>
//         <p style="color: #ccc;">A new service node has been successfully configured. Here are the updated details:</p>
        
//         <div style="background: rgba(34, 211, 238, 0.1); border: 1px solid #22d3ee; padding: 20px; border-radius: 15px; margin: 20px 0;">
//           <p style="margin: 5px 0; color: #fff;"><strong>Order ID:</strong> <span style="color: #22d3ee;">#${randomOrderId}</span></p>
//           <p style="margin: 5px 0; color: #fff;"><strong>Service:</strong> ${orderTitle}</p>
//           <p style="margin: 5px 0; color: #fff;"><strong>Description:</strong> ${description.substring(0, 100)}...</p>
//           <p style="margin: 5px 0; color: #fff;"><strong>Plan:</strong> ${duration} ${planType}</p>
//           <p style="margin: 5px 0; color: #fff;"><strong>Total Amount:</strong> ${totalAmount}</p>
//           <p style="margin: 5px 0; color: #f87171;"><strong>Due Amount:</strong> ${totalAmount}</p>
//           ${planType === "monthly" ? `<p style="margin: 5px 0; color: #fff;"><strong>Monthly Fee:</strong> <span style="color: #22d3ee;">$${monthlyFee}</span></p>` : ""}
//         </div>

//         <div style="background: #111; padding: 20px; border-radius: 15px; border-left: 4px solid #22d3ee;">
//           <p style="margin: 0; color: #22d3ee; font-weight: bold; font-size: 14px;">IMPORTANT DATES:</p>
//           <ul style="color: #ccc; font-size: 13px; padding-left: 20px;">
//             <li>Service Activation: ${new Date().toDateString()}</li>
//             <li>Initial Expiry Date: <strong>${expiryDate.toDateString()}</strong></li>
//           </ul>
//         </div>

//         <div style="text-align: center; margin-top: 30px;">
//           <a href="${process.env.WEBSITE_URL}/my-cluster" style="background: #22d3ee; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; text-transform: uppercase; font-size: 12px;">Go to Dashboard</a>
//         </div>
        
//         <p style="color: #666; font-size: 11px; margin-top: 30px; text-align: center;">Choice Technology Team © 2026 | Secure Ecosystem</p>
//       </div>
//     `;

//     await sendEmail(
//       userEmail,
//       `New Node Initialized - #${randomOrderId}`,
//       htmlContent,
//     );

//     res.status(201).send({
//       success: true,
//       message: "Order created successfully",
//       orderId: randomOrderId,
//     });
//   } catch (error) {
//     res.status(500).send({ success: false, message: "Order creation failed" });
//   }
// };

const createOrder = async (req, res) => {
  try {
    const orderCollection = await collection();
    const {
      userId,
      userEmail,
      orderTitle,
      category,
      planType,
      duration,
      totalAmount,
      description,
      requirementFile,
    } = req.body;

    const randomOrderId = `CT-${Math.floor(1000 + Math.random() * 90000)}`;
    
    const monthlyFee =
      planType === "monthly"
        ? (parseFloat(totalAmount) / parseInt(duration)).toFixed(2)
        : 0;

    let initialExpiry = new Date(); 

    const newOrder = {
      userId,
      userEmail,
      category,
      orderTitle,
      description,
      requirementFile: requirementFile || null,
      orderId: randomOrderId,
      progress: 0,
      planType,
      duration: parseInt(duration),
      totalAmount: parseFloat(totalAmount),
      monthlyFee: parseFloat(monthlyFee),
      paidAmount: 0,
      unPaidAmount: parseFloat(totalAmount),
      expiryDate: initialExpiry,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await orderCollection.insertOne(newOrder);

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; border: 1px solid #22d3ee30; background: #0a0a0a; padding: 30px; border-radius: 20px; margin: auto;">
        <h2 style="color: #22d3ee; text-align: center; text-transform: uppercase;">Node Initialization Pending 🚀</h2>
        <p>Hello,</p>
        <p style="color: #ccc;">Your service node has been registered in the system. To activate the node and start synchronization, please complete the initial payment.</p>
        
        <div style="background: rgba(34, 211, 238, 0.05); border: 1px solid #22d3ee30; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Protocol ID:</strong> <span style="color: #22d3ee;">#${randomOrderId}</span></p>
          <p style="margin: 5px 0;"><strong>Entity:</strong> ${orderTitle}</p>
          <p style="margin: 5px 0;"><strong>Allocation:</strong> ${duration} ${planType}</p>
          <p style="margin: 5px 0;"><strong>Monthly Subscription:</strong> <span style="color: #22d3ee;">$${monthlyFee}</span></p>
          <p style="margin: 15px 0 5px; color: #f87171; font-weight: bold;">Status: ACTION REQUIRED (Payment Pending)</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.WEBSITE_URL}/my-cluster/dashboard/payment/${result.insertedId}" style="background: #22d3ee; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; text-transform: uppercase; font-size: 12px;">Authorize & Pay Now</a>
        </div>
        
        <p style="color: #444; font-size: 11px; margin-top: 30px; text-align: center;">Choice Technology Team © 2026 | Secure Neural Network</p>
      </div>
    `;

    await sendEmail(
      userEmail,
      `Action Required: Node Activation - #${randomOrderId}`,
      htmlContent,
    );

    res.status(201).send({
      success: true,
      message: "Order initialized in pending state",
      orderId: randomOrderId,
      dbId: result.insertedId
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).send({ success: false, message: "Internal System Error" });
  }
};


// const approvePayment = async (req, res) => {
//   try {
//     const orderCollection = await collection();
//     const { orderId, amountPaid } = req.body;

//     const order = await orderCollection.findOne({ orderId: orderId });
//     if (!order)
//       return res
//         .status(404)
//         .send({ success: false, message: "Order not found" });

//     const paymentAmount = parseFloat(amountPaid);
//     const newPaidAmount = order.paidAmount + paymentAmount;
//     const newUnPaidAmount = order.totalAmount - newPaidAmount;

//     let extensionUnits = 1;
//     if (order.planType === "monthly" && order.monthlyFee > 0) {
//       extensionUnits = Math.floor(paymentAmount / order.monthlyFee);
//       if (extensionUnits < 1) extensionUnits = 1;
//     }

//     let currentExpiry = new Date(order.expiryDate);
//     if (currentExpiry < new Date()) currentExpiry = new Date();

//     if (order.planType === "monthly") {
//       currentExpiry.setMonth(currentExpiry.getMonth() + extensionUnits);
//     } else if (order.planType === "days") {
//       currentExpiry.setDate(currentExpiry.getDate() + 7);
//     }

//     const finalStatus = newUnPaidAmount <= 0 ? "completed" : "active";

//     await orderCollection.updateOne(
//       { orderId: orderId },
//       {
//         $set: {
//           paidAmount: newPaidAmount,
//           unPaidAmount: newUnPaidAmount < 0 ? 0 : newUnPaidAmount,
//           lastPayment: paymentAmount,
//           expiryDate: currentExpiry,
//           status: finalStatus,
//           updatedAt: new Date(),
//         },
//       },
//     );

//     const htmlContent = `
//       <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; background: #0a0a0a; padding: 30px; border-radius: 20px; border: 1px solid #22d3ee; margin: auto;">
//         <h2 style="color: #22d3ee; text-align: center;">Payment Verified 💰</h2>
//         <p>Hello,</p>
//         <p>Your payment of <strong>${paymentAmount}</strong> for order <b>#${orderId}</b> has been approved.</p>
        
//         <div style="background: rgba(34, 211, 238, 0.1); border: 1px solid #22d3ee; padding: 20px; border-radius: 15px; margin: 20px 0;">
//           <p><strong>New Expiry Date:</strong> <span style="color: #22d3ee;">${currentExpiry.toDateString()}</span></p>
//           <p><strong>Months Extended:</strong> ${order.planType === "monthly" ? extensionUnits : "N/A"}</p>
//           <p><strong>Remaining Due:</strong> ${newUnPaidAmount < 0 ? 0 : newUnPaidAmount}</p>
//           <p><strong>Status:</strong> <span style="text-transform: capitalize;">${finalStatus}</span></p>
//         </div>

//         <p style="color: #ccc; font-size: 14px;">Your node access has been successfully extended. Thank you for staying with Choice Technology.</p>
//         <p style="color: #666; font-size: 11px; margin-top: 30px; text-align: center;">Choice Technology Team © 2026 | Secure Ecosystem</p>
//       </div>
//     `;

//     await sendEmail(
//       order.userEmail,
//       "Payment Confirmation - Choice Technology",
//       htmlContent,
//     );

//     res.status(200).send({
//       success: true,
//       message: "Payment Approved & Subscription Updated",
//       extendedBy: extensionUnits,
//     });
//   } catch (error) {
//     res.status(500).send({ success: false, message: "Approval failed" });
//   }
// };

const approvePayment = async (req, res) => {
  try {
    const orderCollection = await collection();
    const { orderId, amountPaid } = req.body;

    const order = await orderCollection.findOne({ orderId: orderId });
    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    const paymentAmount = parseFloat(amountPaid);
    const newPaidAmount = order.paidAmount + paymentAmount;
    const newUnPaidAmount = order.totalAmount - newPaidAmount;

    let extensionUnits = 1;
    if (order.planType === "monthly" && order.monthlyFee > 0) {
      extensionUnits = Math.floor(paymentAmount / order.monthlyFee);
      if (extensionUnits < 1) extensionUnits = 1;
    }

    let currentExpiry = new Date(order.expiryDate);
    if (currentExpiry < new Date()) {
      currentExpiry = new Date();
    }

    if (order.planType === "monthly") {
      currentExpiry.setMonth(currentExpiry.getMonth() + extensionUnits);
    } else if (order.planType === "days") {
      currentExpiry.setDate(currentExpiry.getDate() + (parseInt(order.duration) || 7));
    }

    const finalStatus = newUnPaidAmount <= 0 ? "completed" : "active";

    await orderCollection.updateOne(
      { orderId: orderId },
      {
        $set: {
          paidAmount: newPaidAmount,
          unPaidAmount: newUnPaidAmount < 0 ? 0 : newUnPaidAmount,
          lastPayment: paymentAmount,
          expiryDate: currentExpiry,
          status: finalStatus,
          updatedAt: new Date(),
        },
      }
    );

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; background: #0a0a0a; padding: 30px; border-radius: 20px; border: 1px solid #22d3ee; margin: auto;">
        <h2 style="color: #22d3ee; text-align: center;">Node Activated Successfully ⚡</h2>
        <p>Hello,</p>
        <p>Your payment of <strong>$${paymentAmount}</strong> for node <b>#${orderId}</b> has been verified. Your service is now fully operational.</p>
        
        <div style="background: rgba(34, 211, 238, 0.1); border: 1px solid #22d3ee; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <p><strong>Status:</strong> <span style="text-transform: uppercase; color: #22d3ee;">${finalStatus}</span></p>
          <p><strong>New Expiry Date:</strong> <span style="color: #22d3ee;">${currentExpiry.toDateString()}</span></p>
          <p><strong>Remaining Balance:</strong> $${newUnPaidAmount < 0 ? 0 : newUnPaidAmount}</p>
        </div>

        <p style="color: #ccc; font-size: 14px;">The neural synchronization is now active. You can monitor your node progress from the dashboard.</p>
        <p style="color: #666; font-size: 11px; margin-top: 30px; text-align: center;">Choice Technology Team © 2026 | Secure Ecosystem</p>
      </div>
    `;

    await sendEmail(
      order.userEmail,
      "Node Activation Confirmation - Choice Technology",
      htmlContent,
    );

    res.status(200).send({
      success: true,
      message: `Node ${finalStatus === "completed" ? "fully paid" : "activated"} and extended by ${extensionUnits} units.`,
      extendedBy: extensionUnits,
    });

  } catch (error) {
    console.error("Payment Approval Error:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const updateOrderProgress = async (req, res) => {
  try {
    const orderCollection = await collection();
    const { orderId, progressValue } = req.body;

    const result = await orderCollection.updateOne(
      { orderId: orderId },
      { $set: { progress: parseInt(progressValue), updatedAt: new Date() } },
    );

    if (result.modifiedCount > 0) {
      res.status(200).send({
        success: true,
        message: `Progress updated to ${progressValue}%`,
      });
    } else {
      res.status(404).send({ success: false, message: "Order not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Progress update failed" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden Access" });
    }

    const orderCollection = await collection();
    let query = {};

    if (req.query.email) {
      query.userEmail = req.query.email;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalOrders = await orderCollection.countDocuments(query);

    const result = await orderCollection
      .find(query)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      success: true,
      result,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed To Fetch Orders Data" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orderCollection = await collection();
    const { userId } = req.params;
    const orders = await orderCollection
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).send({ success: true, data: orders });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to fetch orders" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderCollection = await collection();
    const { orderId } = req.params;

    if (!ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid MongoDB ID Format" });
    }

    const order = await orderCollection.findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found" });
    }

    if (req.user.role !== "admin" && req.user.email !== order.userEmail) {
      return res
        .status(403)
        .send({ success: false, message: "Unauthorized access" });
    }

    res.status(200).send({ success: true, data: order });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderCollection = await collection();
    const { orderId } = req.params;

    if (!ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid ID Format" });
    }

    const order = await orderCollection.findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found" });
    }

    if (req.user.role !== "admin" && req.user.email !== order.userEmail) {
      return res
        .status(403)
        .send({
          success: false,
          message: "Unauthorized: You cannot cancel this order",
        });
    }

    const result = await orderCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount > 0) {
      res
        .status(200)
        .send({
          success: true,
          message: "Order has been cancelled successfully",
        });
    } else {
      res
        .status(400)
        .send({
          success: false,
          message: "Order is already cancelled or failed to update",
        });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        message: "Internal Server Error during cancellation",
      });
  }
};

module.exports = {
  createOrder,
  approvePayment,
  updateOrderProgress,
  getUserOrders,
  getAllOrders,
  getOrderDetails,
  cancelOrder,
};
