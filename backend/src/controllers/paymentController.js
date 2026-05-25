import Stripe from "stripe";
import { Order } from "../models/orderModel.js";
import { config } from "../config/config.js";
import { Payment } from "../models/paymentModel";

// create a Payment Intent

const stripe = new Stripe(config.stripe.secretKey);

export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.body;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).send({
        status: "error",
        message: "Order not found",
      });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalAmount * 100, //convert to cents
      currency: "Aud",
      metadata: { orderId: order._id.toString() },
    });
    const payment = await Payment.insertOne({
      user: userId,
      order: order._id,
      provider: "stripe",
      amount: order.totalAmount,
      status: "pending",
      tramsactionId: paymentIntent.id,
    });
    return res.status(200).send({
      status: "success",
      message: "payment intent created successfully",
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntent: paymentIntent.id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "failed to create payemt intent",
    });
  }
};

//webhook to handle payment intent status change
export const stripeWebHook = (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig);
    } catch (error) {}
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Failed to process webhook",
    });
  }
};
