import { Order } from "../models/orderModel.js";
import { RefundRequest } from "../models/refundRequestModel.js";
import Product from "../models/productModel.js";

// Customer submits a cancel or return request
// For cancels: order must be pending, confirmed, or processing (not yet shipped/delivered)
// For returns: order must be delivered
// The customer provides a reason and photos
export const submitRefundRequest = async (req, res) => {
  try {
    const userId  = req.user._id;
    const orderId = req.params.orderId;
    const { type, reason, images = [] } = req.body;

    // Validate type
    if (!["cancel", "return"].includes(type)) {
      return res.status(400).send({
        status: "error",
        message: "type must be 'cancel' or 'return'",
      });
    }

    if (!reason || reason.trim().length < 5) {
      return res.status(400).send({
        status: "error",
        message: "Please provide a reason (at least 5 characters)",
      });
    }

    // Find the order
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).send({ status: "error", message: "Order not found" });
    }

    // Enforce rules per type
    if (type === "cancel") {
      const cancellableStatuses = ["pending", "confirmed", "processing"];
      if (!cancellableStatuses.includes(order.orderStatus)) {
        return res.status(400).send({
          status: "error",
          message: `Cannot cancel an order that is already ${order.orderStatus}. If items are delivered, submit a return request instead.`,
        });
      }
    }

    if (type === "return") {
      if (order.orderStatus !== "delivered") {
        return res.status(400).send({
          status: "error",
          message: "Return requests can only be made for delivered orders.",
        });
      }
      // For returns, at least one photo is required
      if (!images || images.length === 0) {
        return res.status(400).send({
          status: "error",
          message: "Please upload at least one photo of the item for a return request.",
        });
      }
    }

    // Check if a refund request already exists for this order
    const existing = await RefundRequest.findOne({ order: orderId });
    if (existing) {
      return res.status(400).send({
        status: "error",
        message: "A refund request already exists for this order.",
      });
    }

    // Create the refund request
    const refundRequest = await RefundRequest.create({
      order: orderId,
      user: userId,
      type,
      reason: reason.trim(),
      images,
    });

    // Mark the order as cancelled (for cancels) or returned (for returns)
    if (type === "cancel") {
      order.orderStatus = "cancelled";
      order.cancelledAt = new Date();
      // Restore product stock
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
    } else {
      order.orderStatus = "returned";
    }
    await order.save();

    return res.status(201).send({
      status: "success",
      message:
        type === "cancel"
          ? "Cancellation request submitted. Refund will be processed once approved by our team."
          : "Return request submitted. Our team will review it and process your refund.",
      data: refundRequest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "error", message: "Failed to submit refund request" });
  }
};

// Customer can view their refund request for an order
export const getMyRefundRequest = async (req, res) => {
  try {
    const userId  = req.user._id;
    const orderId = req.params.orderId;

    const refundRequest = await RefundRequest.findOne({ order: orderId, user: userId })
      .populate("order", "orderNumber totalAmount orderStatus");

    if (!refundRequest) {
      return res.status(404).send({ status: "error", message: "No refund request found for this order" });
    }

    return res.status(200).send({
      status: "success",
      message: "Refund request fetched",
      data: refundRequest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "error", message: "Failed to get refund request" });
  }
};
