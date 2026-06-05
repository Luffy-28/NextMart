import Stripe from "stripe";
import { Order } from "../models/orderModel.js";
import { config } from "../config/config.js";
import { Payment } from "../models/paymentModel.js";

// create a Payment Intent

const stripe = new Stripe(config.stripe.secretKey);

export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).send({
        status: "error",
        message: "Order not found",
      });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), //convert to cents
      currency: "aud",
      metadata: { orderId: order._id.toString() },
    });
    const payment = await Payment.create({
      user: userId,
      order: order._id,
      provider: "stripe",
      amount: order.totalAmount,
      status: "pending",
      transactionId: paymentIntent.id,
    });
    return res.status(200).send({
      status: "success",
      message: "payment intent created successfully",
      data: {
        payment,
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


export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return res.status(400).send({
        status: "error",
        message: "Payment Intent ID is required",
      });
    }

    // Retrieve the payment intent from Stripe directly to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const orderId = paymentIntent.metadata.orderId;

      // Update Order Status to confirmed & paid
      const order = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: "paid", orderStatus: "confirmed" },
        { new: true }
      );

      // Update Payment Record in DB
      const payment = await Payment.findOneAndUpdate(
        { transactionId: paymentIntentId },
        { status: "succeeded", paidAt: new Date() },
        { new: true }
      );

      return res.status(200).send({
        status: "success",
        message: "Payment verified and completed successfully",
        data: { order, payment },
      });
    } else {
      return res.status(400).send({
        status: "error",
        message: `Payment status verification failed. Stripe status: ${paymentIntent.status}`,
      });
    }
  } catch (error) {
    console.error("Confirm payment error:", error);
    return res.status(500).send({
      status: "error",
      message: "Failed to confirm payment details",
    });
  }
};

//webhook to handle payment intent status change
export const stripeWebHook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripe.webhooksecret,
      );
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: "error",
        message: "webhook signature verification failed",
      });
    }
    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          const pi = event.data.object;
          const orderId = pi.metadata.orderId;
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "paid",
            orderStatus: "confirmed",
          });
          await Payment.findOneAndUpdate(
            { transactionId: pi.id },
            { status: "succeeded", paidAt: new Date() },
          );
          console.log(`Payment for order ${orderId} succeeded.`);
          break;
        }
        case "payment_intent.payment_failed": {
          const pi = event.data.object;
          const orderId = pi.metadata.orderId;
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "failed",
            orderStatus: "cancelled",
          });
          await Payment.findOneAndUpdate(
            { transactionId: pi.id },
            { status: "failed", failedAt: new Date() },
          );
          console.log(`Payment for order ${orderId} failed.`);
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
          break;
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "failed to process the webhook event",
      });
    }
    // ALWAYS return 200 OK to Stripe
    return res.status(200).send({ received: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Failed to process webhook",
    });
  }
};
