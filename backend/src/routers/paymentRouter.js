import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createPaymentIntent,
  stripeWebHook,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", authMiddleware, createPaymentIntent);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebHook,
);

export default router;
