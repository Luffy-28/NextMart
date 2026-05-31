import { Order } from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { Cart } from "../models/cartModel.js";
import { Address } from "../models/addressModel.js";

// get all the orders for a user
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      status: "success",
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).send({
      status: "error",
      message: "Failed to get the orders",
    });
  }
};

// get order by Id
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("items.product")
      .populate("shippingAddress");
    if (!order) {
      return res.status(404).send({
        status: "error",
        message: "Order not found",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    return res.status(500).send({
      status: "error",
      message: "Failed to get the order details",
    });
  }
};

// start a new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddressId, paymentMethod = "card" } = req.body;

    if (!shippingAddressId) {
      return res.status(400).send({
        status: "error",
        message: "Shipping address is required",
      });
    }
    const address = await Address.findOne({ _id: shippingAddressId, user: userId });
    if (!address) {
      return res.status(404).send({
        status: "error",
        message: "Shipping address not found",
      });
    }
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).send({
        status: "error",
        message: "Cart is empty",
      });
    }
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = Math.round(subtotal * 0.1);
    const shippingFee = subtotal > 100 ? 0 : 15.99;
    const total = subtotal + tax + shippingFee;
    const order = await Order.create({
      user: userId,
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.name,
        quantity: item.quantity,
        color: item.color,
        price: item.price,
        size: item.size,
      })),
      shippingAddress: shippingAddressId,
      subtotal,
      tax,
      shippingFee,
      totalAmount: total,
      paymentMethod,
    });
    if (!order) {
      return res.status(500).send({
        status: "error",
        message: "Failed to create the order",
      });
    }
    // Clear the cart after order is created and reduce rhe stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    return res.status(201).send({
      status: "success",
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).send({
      status: "error",
      message: "Failed to create the order",
    });
  }
};

// cancel the order
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).send({
        status: "error",
        message: "Order not found",
      });
    }
    // Check if order can be cancelled
    if (order.orderStatus === "cancelled") {
      return res.status(400).send({
        status: "error",
        message: "Order is already cancelled",
      });
    }

    const nonCancellableStatuses = ["shipped", "delivered", "returned"];
    if (nonCancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).send({
        status: "error",
        message: `Order cannot be cancelled as it is already ${order.orderStatus}`,
      });
    }

    // Update order status
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    // Restore product inventories
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).send({
      status: "error",
      message: "Failed to cancel the order",
    });
  }
};
