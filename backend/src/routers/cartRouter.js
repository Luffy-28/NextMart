import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addTocart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addTocart);
router.patch("/update", authMiddleware, updateCartQuantity);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;
