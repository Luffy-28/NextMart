import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { Cart } from "../models/cartModel.js";

// get all the orders for a user
export const getAllorders = async (req, res) => {
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

    const order = await Order.findById(orderId)
      .populate("items.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).send({
        status: "error",
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).send({
        status: "error",
        message: "You are not authorized to view this order",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Order fetched successfully",
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
    const {
      items,
      shippingAddress,
      paymentMethod,
      shippingFee,
      tax,
      discount,
      couponCode,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send({
        status: "error",
        message: "Order items are required and must not be empty",
      });
    }

    if (!shippingAddress) {
      return res.status(400).send({
        status: "error",
        message: "Shipping address is required",
      });
    }

    // 1. Server-side validation, price verification, and stock checking
    let calculatedSubtotal = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.product || !item.quantity) {
        return res.status(400).send({
          status: "error",
          message: "Each order item must contain product and quantity",
        });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).send({
          status: "error",
          message: `Product with ID ${item.product} not found`,
        });
      }

      if (!product.isActive) {
        return res.status(400).send({
          status: "error",
          message: `Product ${product.name} is currently inactive`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).send({
          status: "error",
          message: `Insufficient stock for product: ${product.name}. Only ${product.stock} available.`,
        });
      }

      const itemPrice = product.discountedPrice || product.basePrice;
      calculatedSubtotal += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: (product.images && product.images[0]) || "",
        color: item.color || product.color || "",
        size: item.size || product.size || "",
        price: itemPrice,
        quantity: item.quantity,
      });
    }

    const fee = Number(shippingFee) || 0;
    const taxAmount = Number(tax) || 0;
    const discountAmount = Number(discount) || 0;
    const calculatedTotal = calculatedSubtotal + fee + taxAmount - discountAmount;

    // 2. Generate a unique human-readable order number
    const orderNumber = `NM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Create the Order in DB
    const order = new Order({
      orderNumber,
      user: userId,
      items: orderItems,
      shippingAddress,
      subtotal: calculatedSubtotal,
      shippingFee: fee,
      tax: taxAmount,
      discount: discountAmount,
      couponCode: couponCode || "",
      totalAmount: calculatedTotal,
      paymentMethod: paymentMethod || "card",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    await order.save();

    // 4. Update product inventories
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 5. Clear user's shopping cart
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalAmount: 0 },
      { new: true }
    );

    return res.status(201).send({
      status: "success",
      message: "Order created successfully",
      data: order,
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

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({
        status: "error",
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).send({
        status: "error",
        message: "You are not authorized to cancel this order",
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
