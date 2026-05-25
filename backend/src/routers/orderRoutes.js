import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getOrderById,
  createOrder,
  cancelOrder,
  getMyOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/create", authMiddleware, createOrder);
router.patch("/cancel/:id", authMiddleware, cancelOrder);

export default router;
