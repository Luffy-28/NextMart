import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All wishlist routes require login
router.get("/",                      authMiddleware, getWishlist);
router.post("/add/:productId",       authMiddleware, addToWishlist);
router.delete("/remove/:productId",  authMiddleware, removeFromWishlist);
router.delete("/clear",              authMiddleware, clearWishlist);

export default router;
