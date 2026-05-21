import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllorders,
  getOrderById,
  createOrder,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllorders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, createOrder);
router.patch("/:id/cancel", authMiddleware, cancelOrder);

export default router;
