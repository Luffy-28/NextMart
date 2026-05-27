import express from "express";
import {
  addReview,
  deleteReview,
  getReviewByProduct,
  updateReview,
} from "../controllers/reviewController.js";
const router = express.Router();

router.post("/:orderId/:productId", authMiddleware, addReview);
router.get("/product/:productId", getReviewByProduct);
router.put("/:reviewId", authMiddleware, updateReview);
router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;
