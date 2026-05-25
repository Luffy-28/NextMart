import express from "express";
import {
  addTocart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", getCart);
router.post("/add", addTocart);
router.patch("/update", updateCartQuantity);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
